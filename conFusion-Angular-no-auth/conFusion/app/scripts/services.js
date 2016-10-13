'use strict';

angular.module('confusionApp')
  .constant("baseURL","http://localhost:3000/") //eventually replace localhost with the REST server IP
  .service('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {

				this.getDishes = function(){
                                        return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
                                    };

				this.getPromotions = function () {
										return $resource(baseURL+"promotions/:id",null,  {'update':{method:'PUT' }});
				};

        }])


    .service('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {

			this.getLeaders = function(){
                                        return $resource(baseURL+"leadership/:id",null,  {'update':{method:'PUT' }});
                                    };
        }])


	.service('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {

			this.getFeedbacks = function(){
                                        return $resource(baseURL+"feedback/:id",null,  {'update':{method:'PUT' }});
                                    };
		}])

;
