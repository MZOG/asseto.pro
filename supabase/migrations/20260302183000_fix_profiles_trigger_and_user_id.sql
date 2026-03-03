alter table public.profiles
  add column if not exists user_id uuid;

alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  add column if not exists company_name text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_user_id_fkey'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end
$$;

create unique index if not exists profiles_user_id_key
  on public.profiles (user_id)
  where user_id is not null;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_name text := coalesce(new.raw_user_meta_data ->> 'company_name', '');
begin
  update public.profiles
  set
    user_id = coalesce(user_id, new.id),
    email = coalesce(new.email, email),
    company_name = case
      when v_company_name = '' then company_name
      else v_company_name
    end
  where user_id = new.id
     or (new.email is not null and email = new.email);

  if not found then
    insert into public.profiles (user_id, email, company_name)
    values (new.id, new.email, v_company_name);
  end if;

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
