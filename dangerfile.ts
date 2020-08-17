import { fail, markdown } from "danger";
import { sanityCheckAll } from "./script/action/update-all";

sanityCheckAll().then(errors => {
    if (errors.length > 0) {
        errors.forEach(err => fail(err));
        markdown("Please fix the errors above.  Files can be replaced/renamed in this pull request (using command-line, or GitHub Desktop).  Alternatively, you may close this pull request and open a new one.");
    }
});
