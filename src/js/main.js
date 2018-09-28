function getFileName () {
  var file = document.getElementById('uploaded-file').value;
  file = file.replace (/\\/g, '/').split('/').pop();
  document.getElementById('file-name').innerHTML = 'Имя файла: ' + file; 
}

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
  $('#clock').countdown('2020/10/10', function(event) {
    var $this = $(this).html(event.strftime(''
      + `<div class="itemTime">
          <span class="textTime">%H</span>
          <span class="subText">часов</span>
          <span class="semicolon">
            <span class="semicolonItem"></span>
            <span class="semicolonItem"></span>
          </span>
        </div>`
      + `<div class="itemTime">
          <span class="textTime">%M</span>
          <span class="subText">минут</span>
          <span class="semicolon">
            <span class="semicolonItem"></span>
            <span class="semicolonItem"></span>
          </span>
        </div>`
      + `<div class="itemTime">
          <span class="textTime">%S</span>
          <span class="subText">секунд</span>
        </div>`));
  });
  $('.select').niceSelect();
});
