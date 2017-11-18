(function () {
    'use strict';

    const PATH = 'modules/utils/modals/transactionInfo/types';

    /**
     *
     * @param Base
     * @param $scope
     * @param $filter
     * @param {TransactionsService} transactionsService
     * @param blocksService
     * @param explorerLinks
     * @return {TransactionInfoCtrl}
     */
    const controller = function (Base, $scope, $filter, transactionsService, blocksService, explorerLinks) {

        class TransactionInfoCtrl extends Base {

            constructor({ transactionId }) {
                super($scope);
                transactionsService.get(transactionId)
                    .then((transaction) => {
                        this.transaction = transaction;

                        this.templateUrl = `${PATH}/${this.transaction.templateType}.html`;
                        this.datetime = $filter('date')(this.transaction.timestamp, 'dd.MM.yyyy, hh:mm');
                        this.shownAddress = this.transaction.shownAddress;
                        this.type = this.transaction.type;

                        this.explorerLink = explorerLinks.getTxLink(this.transaction.id);

                        if (this.transaction.height >= 0) {
                            blocksService.getHeight().then((height) => {
                                this.confirmations = height - this.transaction.height;
                            });
                        } else {
                            this.confirmations = -1
                        }
                    });
            }

        }

        return new TransactionInfoCtrl(this.locals);
    };

    controller.$inject = ['Base', '$scope', '$filter', 'transactionsService', 'blocksService', 'explorerLinks'];

    angular.module('app.utils').controller('TransactionInfoCtrl', controller);
})();
