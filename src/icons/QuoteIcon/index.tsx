import * as React from 'react'

type Props = {
  className?: string
}
export const QuoteIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="30"
      viewBox="0 0 33 30"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.5736 16.9105C19.5736 12.7384 20.5057 9.232 22.3698 6.39138C24.3228 3.55077 27.6516 1.42031 32.3564 0V6.65769C29.9596 7.45662 28.3174 8.61062 27.4297 10.1197C26.542 11.54 26.1425 13.8036 26.2313 16.9105H32.3564V29.6933H19.5736V16.9105ZM0 16.9105C0 12.7384 0.932077 9.232 2.79623 6.39138C4.74915 3.55077 8.078 1.42031 12.7828 0V6.65769C10.386 7.45662 8.74377 8.61062 7.85608 10.1197C6.96839 11.54 6.56892 13.8036 6.65769 16.9105H12.7828V29.6933H0V16.9105Z"
        fill="currentColor"
      />
    </svg>
  )
}
