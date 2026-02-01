-- Function to update spot stats
create or replace function update_spot_stats()
returns trigger as $$
begin
  update public.spots
  set 
    average_rating = (select avg(rating)::numeric(2,1) from spot_verifications where spot_id = new.spot_id and rating is not null),
    rating_count = (select count(*) from spot_verifications where spot_id = new.spot_id and rating is not null)
  where id = new.spot_id;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_verification_created_stats on public.spot_verifications;
create trigger on_verification_created_stats
  after insert on public.spot_verifications
  for each row execute procedure update_spot_stats();
