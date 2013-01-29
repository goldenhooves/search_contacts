/*
* Author: David Herse
* DateEdited: 29th Jan 2013
* Reusable search constructor
*/

(function($) {
    
    /*
     * Search constructor
     * The idea here was to create a reusable search constructor where you pass in
     * a bunch of details and the search would look after the rest.
     * This could be improved by:
     * - Refining what elements are required to be passed into the search Construtor  
     * - Waiting for the data to return successfully before allowing searches 
     * - Scoping the search to certain fields
     * - Adding ability to pass in field hierarchy
     */
    var  Search = function(args) {            
            this.data = [];
            this.uri = args.uri;
            this.$search = args.$search;
            this.$input = args.$input;
            this.$results = args.$results;
            this.$output = args.$output;
            this.$errorMessage = args.$errorMessage;
            this.$noneFound = args.$noneFound;
            this.$validationMessage = args.$validationMessage;
            this.$form = args.$form;
            this.init();

    };
    
    // add the Search methods to the prototype
    Search.prototype = {
        
        // init the search by binding events and calling the getData
        init: function() {
            var that = this;
            
            // bind to submit event and pass value to search function
              that.$form.on('submit', function(e) {
                  e.preventDefault();
                  that.submitSearch();

              })

            // submit the search on keyup
            that.$input.on('keyup', function(e) {
                that.submitSearch();

            });
            // get the contact data
            that.getData();
        },
        
        //use the set URI to retrieve all the data
        getData: function() {
            var that = this;
            $.ajax({
                url: that.uri,
                dataType: "json",
                success: function(resonse) {
                    that.data = resonse;

                },

                error: function() {
                    // on error show error message
                    that.$errorMessage.show();
                }
            });
        },
        
        // Render out the result of the search
        renderResult: function(results) {
            
            var that = this,
                snippet = "";
                         
                that.$validationMessage.hide();
                
                // check if there are any results
            if (results.length > 0) {
                
                // build up result rows
                for (var i = 0; i < results.length; i++) {
                    snippet += '<tr><td>' + results[i].first_name + ' ' + results[i].last_name + '</td><td>' + results[i].email + '</td><td>' + results[i].phone_number + '</td></tr>';
                };
                
                // show output and hide any other messages
                that.$output.html(snippet);
                that.$noneFound.hide();
                that.$results.show();
                
            } else {
                // else show the no results message                
                that.$results.hide();
                that.$noneFound.show();
            }

        },
        
        // search the data
        searchData: function(value) {
            var that = this,
                data = that.data,
                value_regex = new RegExp(value, 'gi'),

                // find matches
                results = $.grep(data, function(item, i) {
                    var match = false;
                
                    // iterate through data values
                    for (var key in item) {
                        // test the regex and make sure it's a string.
                        // Also remove any spaces for better matching
                            if (value_regex.test(item[key].toString().replace(/ /g, '')) === true) {
                                match = true;
                                break;
                            }
                    
                    }

                    return match;
                });

            return results;
        },
        
        // if input has no value, show the validaiton message
        showValidationMessage: function() {
            var that = this;
            
            that.$noneFound.hide();
            that.$results.hide();
            that.$validationMessage.show();

        },
        
        // submit the search
        submitSearch: function() {
            var that = this;
            
            var value = that.$input.val();
            
            // check the input is valid
            if (that.validateInput(value)) {
                // Render the result
                that.renderResult(that.searchData(value));
                
            } else {
                // else show the validation message
                that.showValidationMessage();
            }
        },
        
        // validate the search input to have a value
        validateInput: function(value) {
            return (value.replace(/ /g, '') !== '');

        }

    }

    // create the new SeachContacts instance
    var searchContacts = new Search({
            $search : $('#search'),
            $input : $('#search input'),
            $results : $('#results'),
            $output : $('#results .output'),
            $errorMessage : $('#error'),
            $noneFound : $('#none_found'),
            $validationMessage : $('#validation'),
            $form : $('#search_form'),
            uri : '/contacts.json'
    });


})(jQuery);
