-- Harden RPC function security by revoking execution privileges from anonymous and public roles
REVOKE EXECUTE ON FUNCTION public.get_profile_email(UUID) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_profile_email(UUID) TO authenticated, service_role;
