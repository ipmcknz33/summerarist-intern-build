import styles from "./Skeleton.module.css";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function Skeleton({ className = "", style }: Props) {
  return <div className={`${styles.skeleton} ${className}`} style={style} />;
}