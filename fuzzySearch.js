/*
 FuzzySearch 使用
 result - 搜索的范围值
 resultBox - 搜索下拉框( 用来显示结果 )
 */
;(function($, undefined) {
    var pluginName = 'FuzzySearch',
        searchMember = {},  // 初始化结果对象
        searchArr = {};     // 初始化空对象( 用来装范围缩小的搜索结果 )

    // 初始化
    function FuzzySearch(ele, opt) {
        this.$element = $(ele);             // jQuery对象
        this.defaults = {
            result: '',
            resultBox: ''                   // 搜索下拉框( 用来显示结果 )
        };
        this.options = $.extend({}, this.defaults, opt);        // 参数
        // 调用其方法
        this.init();
    }

    FuzzySearch.prototype = {
        init: function() {
            var self = this,
                searchChange = ' ';       // 搜索框不断改变的值( 用来保留上次的值 )

            // 搜索值初始化
            self._loadData();

            this.$element.off('keyup.searchdir').on('keyup.searchdir', function(evt) {
                var $resultBox = $(self.options.resultBox),     // 搜索框
                    searchValue = this.value;       // 搜索框值

                // 显示搜索结果
                if (searchValue === '') {
                    $resultBox.hide();
                } else {
                    $resultBox.show();
                }
                (function() {
                    $resultBox.html('');
                    var fragment = document.createDocumentFragment();   // 创建文档碎片

                    // 判断是在原字符上增加搜索
                    if (searchValue.indexOf(searchChange) > -1 && (searchValue.length > searchChange.length)){
                        var searchArrFlag = searchArr;      // 临时保存的搜索结果
                        searchArr = {};
                        self._searchInto(searchValue, searchArrFlag);
                        console.log(1)
                    } else {
                        self._searchInto(searchValue, searchMember)
                    }
                })();

                // 判断搜索值改变
                if (searchChange === '' || searchValue !== searchChange) {
                    searchChange = searchValue;
                }
            });
        },

        // 在结果数据中操作
        _searchInto: function(searchV, result) {
            var self = this,
                fragment = document.createDocumentFragment();   // 创建文档碎片
            for (var m in result) {
                var searchR = result[m],          // 搜索结果
                    searchIndex = searchR.indexOf(searchV);    // 搜索结果 是否包含 搜索框值
                if (searchIndex > -1) {
                    var liNode = '<li><a data-id=' + m + '>' + result[m] + '</a></li>';
                    $(liNode).appendTo(fragment);
                    searchArr[m] = result[m];
                }
            }

            $(fragment).appendTo(self.options.resultBox);
        },

        _loadData: function() {
            var self = this,
                memberLi = $(self.options.result);
            $.each(memberLi, function(i, memberArr){
                var memberName = memberArr.innerHTML,
                    memberId = $(memberArr).data('id');
                searchMember[memberId] = memberName;
            })
        }
    };

    $.fn[pluginName] = function(options) {
        this.each(function() {
            // each中的this指向DOM原生对象
            if (!$(this).data('plugin_' + pluginName)) {
                $(this).data('plugin_' + pluginName, new FuzzySearch(this, options));
            }
        });
    }
})(jQuery);