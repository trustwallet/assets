import { fail, warn, markdown } from "danger";
import { sanityCheckAll } from "./script/generic/update-all";

sanityCheckAll().then(([errors, warnings]) => {
    errors.forEach(err => fail(err));
    warnings.forEach(err => warn(err));
    if (errors.length > 0 || warnings.length > 0) {
        markdown("Please fix the errors/warnings above.  Files can be replaced/renamed in this pull request (using command-line, or GitHub Desktop).  Alternatively, you may close this pull request and open a new one.");
    }
});
