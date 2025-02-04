import { SocialIcon } from '@components/SocialIcon'
import type { Post } from '@types'

type GuestSocialProps = {
  guestSocials: NonNullable<Post['guestSocials']>
  className?: string
}

export const GuestSocials: React.FC<GuestSocialProps> = ({ guestSocials }) => {
  return (
    <>
      {guestSocials.youtube && (
        <SocialIcon platform="youtube" size="small" href={guestSocials.youtube} />
      )}
      {guestSocials.twitter && (
        <SocialIcon platform="twitter" size="small" href={guestSocials.twitter} />
      )}
      {guestSocials.linkedin && (
        <SocialIcon platform="linkedin" size="small" href={guestSocials.linkedin} />
      )}
      {guestSocials.website && (
        <SocialIcon platform="web" size="small" href={guestSocials.website} />
      )}
    </>
  )
}
