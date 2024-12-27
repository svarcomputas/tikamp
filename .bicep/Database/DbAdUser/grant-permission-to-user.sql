DO $$
BEGIN
CREATE ROLE "app_${applicationDbName}_user";
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'not creating role app_${applicationDbName}_user -- it already exists';
END
$$;

GRANT CONNECT ON DATABASE $applicationDbName TO "app_${applicationDbName}_user";
GRANT USAGE ON SCHEMA public TO "app_${applicationDbName}_user";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "app_${applicationDbName}_user";
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO "app_${applicationDbName}_user";
-- Grant access to future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "app_${applicationDbName}_user";

GRANT "app_${applicationDbName}_user" TO "${applicationDbAdUser}";