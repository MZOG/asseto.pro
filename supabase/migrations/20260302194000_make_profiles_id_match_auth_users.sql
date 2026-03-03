alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  add column if not exists company_name text;

do $$
declare
  id_type text;
  unmapped_count bigint;
begin
  select data_type
  into id_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'profiles'
    and column_name = 'id';

  if id_type is distinct from 'uuid' then
    alter table public.profiles
      add column if not exists auth_user_id uuid;

    update public.profiles p
    set auth_user_id = u.id
    from auth.users u
    where p.auth_user_id is null
      and p.email is not null
      and lower(p.email) = lower(u.email);

    select count(*) into unmapped_count
    from public.profiles
    where auth_user_id is null;

    if unmapped_count > 0 then
      raise exception 'Nie mozna zmigrowac profiles.id do uuid. % rekordow profiles nie ma dopasowania do auth.users po email.', unmapped_count;
    end if;

    alter table public.profiles drop constraint if exists profiles_pkey;
    alter table public.profiles alter column id drop identity if exists;
    alter table public.profiles alter column id drop default;
    alter table public.profiles rename column id to legacy_id;
    alter table public.profiles rename column auth_user_id to id;
    alter table public.profiles alter column id set not null;
    alter table public.profiles add constraint profiles_pkey primary key (id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_id_fkey'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users(id) on delete cascade;
  end if;
end;
$$;

alter table public.profiles
  drop constraint if exists profiles_user_id_fkey;

drop index if exists profiles_user_id_key;

alter table public.profiles
  drop column if exists user_id;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, company_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'company_name', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    company_name = case
      when excluded.company_name is null or excluded.company_name = '' then public.profiles.company_name
      else excluded.company_name
    end;

  return new;
exception
  when others then
    raise warning 'handle_new_user_profile failed for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user_profile();
