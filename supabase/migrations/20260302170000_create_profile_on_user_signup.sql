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
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user_profile();
