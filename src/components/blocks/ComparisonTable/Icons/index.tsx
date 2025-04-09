import classes from '../index.module.scss'

const TableXIcon = () => (
  <svg
    className={classes.icon}
    fill="none"
    height="26"
    viewBox="0 0 26 26"
    width="26"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.2116 17.3607L8.89475 9.04388M8.89553 17.3606L17.2124 9.04379M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z"
      stroke="var(--theme-error-500)"
      strokeWidth={2}
    />
  </svg>
)

const TableCheckIcon = () => (
  <svg
    className={classes.icon}
    fill="none"
    height="26"
    viewBox="0 0 26 26"
    width="26"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.4 13L11.8 15.4L16.6 10.6M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z"
      stroke="var(--theme-success-600)"
      strokeLinecap="square"
      strokeWidth={2}
    />
  </svg>
)

export const TableIcon: React.FC<{ checked: boolean }> = ({ checked }) =>
  checked ? <TableCheckIcon /> : <TableXIcon />
