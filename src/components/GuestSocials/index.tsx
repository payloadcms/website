import type { Post } from '@types'

import { SocialIcon } from '@components/SocialIcon'

type GuestSocialProps = {
  className?: string
  guestSocials: NonNullable<Post['guestSocials']>
}

export const GuestSocials: React.FC<GuestSocialProps> = ({ guestSocials }) => {
  return (
    <>
      {guestSocials.youtube && (
        <SocialIcon href={guestSocials.youtube} platform="youtube" size="small" />
      )}
      {guestSocials.twitter && (
        <SocialIcon href={guestSocials.twitter} platform="twitter" size="small" />
      )}
      {guestSocials.linkedin && (
        <SocialIcon href={guestSocials.linkedin} platform="linkedin" size="small" />
      )}
      {guestSocials.website && (
        <SocialIcon href={guestSocials.website} platform="web" size="small" />
      )}
    </>
  )
}
