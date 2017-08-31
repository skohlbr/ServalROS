const bundleWithFlag = {bundle:{}, flag:false};

class BundleManager {

    flaggedBundleList = [];

    constructor(initialBundleList) {
        for (let currentBundle in newBundleList) {

            // TODO: check if "currentBundle exists etc..
            this.flaggedBundleList.push( {bundle: currentBundle, flag: true} );
        }

    }

    addNewBundles(newBundleList){
        for (let currentBundle in newBundleList) {

            // TODO: check if "currentBundle exists etc..
            if (this.isNewBundle(bundleWithFlag)) {

                // then add to list flaggedBundleList like
                this.flaggedBundleList.push( {bundle: currentBundle, flag: false} );

            }
        }
    }

    isNewBundle(bundle){
        // todo: determine if bundle is new
        return false;
    }

    getLatestUnprocessedBundle() {
        // TODO: get next bundle in list
    }

}
