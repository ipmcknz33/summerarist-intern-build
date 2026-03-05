import Skeleton from "./Skeleton";
import styles from "./BookCardSkeleton.module.css";

type Props = {
  className?: string;
};

export default function BookCardSkeleton({ className = "" }: Props) {
  return (
    <div className={`${styles.card} ${className}`}>
      <Skeleton className={styles.cover} />
      <div className={styles.meta}>
        <Skeleton className={styles.title} />
        <Skeleton className={styles.author} />
      </div>
    </div>
  );
}