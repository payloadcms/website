import classes from './styles.module.scss'

export const MaxWidth: React.FC<{ children: React.ReactNode }> = props => {
  return <div className={classes.pageMaxWidth}>{props.children}</div>
}
