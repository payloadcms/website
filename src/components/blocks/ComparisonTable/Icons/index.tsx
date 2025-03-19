import classes from '../index.module.scss'

const TableXIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={classes.icon}
  >
    <path
      d="M17.2116 17.3607L8.89475 9.04388M8.89553 17.3606L17.2124 9.04379M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z"
      strokeWidth={2}
      stroke="var(--theme-error-500)"
    />
  </svg>
)

const TableCheckIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={classes.icon}
  >
    <path
      d="M9.4 13L11.8 15.4L16.6 10.6M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z"
      strokeWidth={2}
      stroke="var(--theme-success-600)"
      strokeLinecap="square"
    />
  </svg>
)

export const TableIcon: React.FC<{ checked: boolean }> = ({ checked }) =>
  checked ? <TableCheckIcon /> : <TableXIcon />
