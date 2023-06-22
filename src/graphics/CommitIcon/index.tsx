import React from 'react'

type Props = {
  className?: string
}
export const CommitIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="1.05" y1="12" x2="7" y2="12"></line>
      <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
    </svg>
  )

  // return (
  //   <svg
  //     className={className}
  //     width="24"
  //     height="24"
  //     viewBox="0 0 24 24"
  //     fill="none"
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <path
  //       d="M11.5 15C13.433 15 15 13.433 15 11.5C15 9.567 13.433 8 11.5 8C9.567 8 8 9.567 8 11.5C8 13.433 9.567 15 11.5 15Z"
  //       stroke="currentColor"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     />
  //     <line x1="15.5" y1="11.5" x2="20.5" y2="11.5" stroke="currentColor" strokeLinecap="round" />
  //     <line x1="2.5" y1="11.5" x2="7.5" y2="11.5" stroke="currentColor" strokeLinecap="round" />
  //   </svg>
  // )
  // return (
  //   <svg
  //     className={className}
  //     xmlns="http://www.w3.org/2000/svg"
  //     width="24"
  //     height="24"
  //     viewBox="0 0 24 24"
  //     fill="none"
  //     stroke="currentColor"
  //     stroke-width="2"
  //     stroke-linecap="round"
  //     stroke-linejoin="round"
  //   >
  //     <circle cx="12" cy="12" r="3" />
  //     <line x1="3" x2="9" y1="12" y2="12" />
  //     <line x1="15" x2="21" y1="12" y2="12" />
  //   </svg>
  // )
}
