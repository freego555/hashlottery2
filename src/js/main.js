function getFileName () {
  var file = document.getElementById('uploaded-file').value;
  file = file.replace (/\\/g, '/').split('/').pop();
  document.getElementById('file-name').innerHTML = 'Имя файла: ' + file; 
}

(function($) {
    $(document).ready(function() {
        // Main scripts
        $(".lotteryMain__showToggleContent").on('click', function() {
            if($(".lotteryMain__toggleContent").hasClass('hideContent')) {
                $(".lotteryMain__toggleContent").removeClass('hideContent');
                $(this).text('Скрыть');
                $(this).addClass('active');
            } else {
                $(".lotteryMain__toggleContent").addClass('hideContent');
                $(this).text('Показать больше');
                $(this).removeClass('active');
            }
        });
    });
})(jQuery);

