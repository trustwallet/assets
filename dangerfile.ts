import { message, danger, markdown, warn } from "danger";
import { sanityCheckAll } from "./script/action/update-all";

sanityCheckAll().then(sanityErrors => {
    sanityErrors.forEach(err => warn(err));
});
