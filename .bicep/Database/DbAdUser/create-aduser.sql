DO $$
BEGIN

    IF '${applicationDbAdUserPrincipalId}' != ''
        THEN
          IF EXISTS (
            SELECT from pg_catalog.pgaadauth_list_principals(false)
            WHERE rolname = '${applicationDbAdUser}'
            and objectid != '${applicationDbAdUserPrincipalId}') THEN
        EXECUTE 'DROP ROLE "${applicationDbAdUser}"';
END IF;
END IF;

    IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = '${applicationDbAdUser}') THEN
        PERFORM pg_catalog.pgaadauth_create_principal('${applicationDbAdUser}', false, false);
END IF;
END
$$;
