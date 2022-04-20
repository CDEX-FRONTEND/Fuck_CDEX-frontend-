import { Pagination } from "@material-ui/lab";
import { ChangeEvent } from "react";
import styles from "./style.module.scss";

interface PaginationProps {
  pagesCount: number;
  selectedPage: number;
  onSelectPage?: (event: ChangeEvent<unknown>, page: number) => void;
}

const PagingNavigation = ({
  pagesCount,
  selectedPage,
  onSelectPage,
}: PaginationProps) => {
  return (
    <div className={styles.pagingNavigation}>
      <Pagination
        count={pagesCount}
        size="large"
        variant="outlined"
        hidePrevButton
        hideNextButton
        onChange={onSelectPage ? onSelectPage : () => {}}
      />
    </div>
  );
};

export default PagingNavigation;
