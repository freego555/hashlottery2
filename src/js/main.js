function getFileName () {
  var file = document.getElementById('uploaded-file').value;
  file = file.replace (/\\/g, '/').split('/').pop();
  document.getElementById('file-name').innerHTML = 'Имя файла: ' + file; 
}

document.addEventListener("DOMContentLoaded", function(){
    const button = document.querySelector('.lotteryMain__showToggleContent')
    button.addEventListener('click', () => {
        const toggleContent = document.querySelector('.lotteryMain__toggleContent')
        if(toggleContent.classList.contains('hideContent')) {
            toggleContent.classList.remove('hideContent')
            button.classList.add('active')
            button.innerHTML = 'Скрыть'
        } else {
            toggleContent.classList.add('hideContent')
            button.classList.remove('active')
            button.innerHTML = 'Показать больше'
        }
    })
});

// (function($) {
//     $(document).ready(function() {
//         // Main scripts
//         $(".lotteryMain__showToggleContent").on('click', function() {
//             if($(".lotteryMain__toggleContent").hasClass('hideContent')) {
//                 $(".lotteryMain__toggleContent").removeClass('hideContent')
//                 $(this).text('Скрыть');
//                 $(this).addClass('active');
//             } else {
//                 $(".lotteryMain__toggleContent").addClass('hideContent');
//                 $(this).text('Показать больше');
//                 $(this).removeClass('active');
//             }
//         });
//     });
// })(jQuery);
//
