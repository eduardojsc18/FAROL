create
or replace function add_new_user_to_profile_function()
returns trigger as $$
declare
auth_provider text;
begin
  auth_provider := new.raw_user_meta_data->>'provider';

  if auth_provider = 'apple' then
    insert into public.profiles (id, email, username, name, avatar_url)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'email',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'avatar_url'
    );
  elsif auth_provider = 'google' then
    insert into public.profiles (id, email, username, name, avatar_url)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'email',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'picture'
    );
  elsif auth_provider = 'facebook' then
    insert into public.profiles (id, email, username, name, avatar_url)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'email',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'picture'
    );
  elsif auth_provider = 'email' then
    insert into public.profiles (id, email, username, name, avatar_url)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'avatar_url'
    );
  elsif auth_provider = 'github' then
    insert into public.profiles (id, email, username, name, avatar_url)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'avatar_url'
    );
end if;

return new;
end;
$$ language plpgsql security definer;
