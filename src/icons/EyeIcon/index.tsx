import * as React from 'react'

type Props = {
  className?: string
}
export const EyeIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.62398 13.0466C4.56935 12.917 4.56935 12.7768 4.62398 12.6472C5.72202 10.0391 8.83882 8.15784 12.5121 8.15784C16.1839 8.15784 19.2991 10.0372 20.3995 12.6441C20.4549 12.7735 20.4549 12.9135 20.3995 13.0435C19.3023 15.6516 16.1855 17.5328 12.5121 17.5328C8.8404 17.5328 5.72519 15.6535 4.62477 13.0466H4.62398Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.8867 12.8453C14.8867 13.3426 14.6365 13.8195 14.1911 14.1712C13.7457 14.5228 13.1416 14.7203 12.5117 14.7203C11.8818 14.7203 11.2777 14.5228 10.8323 14.1712C10.3869 13.8195 10.1367 13.3426 10.1367 12.8453C10.1367 12.3481 10.3869 11.8711 10.8323 11.5195C11.2777 11.1679 11.8818 10.9703 12.5117 10.9703C13.1416 10.9703 13.7457 11.1679 14.1911 11.5195C14.6365 11.8711 14.8867 12.3481 14.8867 12.8453V12.8453Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
