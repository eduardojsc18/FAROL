
create
or replace function add_new_user_to_profile_function()
  returns trigger as $$
begin
insert into public.profiles (id, email, username, name, avatar_url)
values (
   new.id,
   new.email,
   -- Usa COALESCE para garantir que o campo correto seja preenchido conforme o provedor OAuth
   coalesce(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'nickname', new.raw_user_meta_data->>'email'),
   coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
   coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'photo_url', new.raw_user_meta_data->>'picture')
);
return new;
end;
$$ language plpgsql security definer;
