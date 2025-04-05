create table
    connections (
        id uuid primary key default gen_random_uuid(),
        profile_id uuid references public.profiles (id),

        title varchar not null,
        description varchar,
        type varchar,
        status varchar,
        status_message varchar,
        oauth_id varchar,
        access_token varchar,
        refresh_token varchar,
        expires_in varchar,

        account_info jsonb,

        created_at timestamp with time zone default current_timestamp not null,
        updated_at timestamp with time zone default current_timestamp not null
    )
