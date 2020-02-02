// $(document).ready(function(){
    
// });

console.log("interact.js")
// Totla Number of questions
var totalQuestions = 2;
var currentQuestion = 0;

//******* CONNECTION *********//

function emailCheck(val){
   
    // EMAIL CHECKER
   /* if(val.indexOf("@")<=0){
       console.log("nope");
       }else{
           console.log("presque");
           if(val.indexOf(".")>=0 && val.indexOf(".")>val.indexOf("@")+1 && val.indexOf(".")<val.length-2){
               console.log ("GOOOOOOOOOOO");
           }
       }*/
    
    // EMAIL EXTENSION CHECKER
    if(val.indexOf("cdc.com") >=4){
        $('.connect_button').addClass('input_button__active');
        //CONNECT OK
        $('.connect_button.input_button__active').click(function(){
            connectOK();
        })
       }else{
           $('.connect_button').removeClass('input_button__active');
       }
}

function connectOK(){
    
    // HIDE WELCOME CARD
    $('.welcome_card').animate({
        opacity: 0,
        left: "-=50",
      }, 250, function() {
        // Animation complete.
         $('.welcome_card').css("display","none");
        
         //SHOW START CARD
        $('.start_card').css("display","flex");

        $('.start_card').animate({
            opacity: 1,
            left: "0",
          }, 250, function() {
            // Animation complete.
        });
    });
    
}
//******* END-CONNECTION *********//

//******* START QUIZZ *********//

function chooseQuizz(total){
    $('.quizz_active').removeClass("quizz_active");
    $('#quizz_choice_'+total).addClass("quizz_active");
    
    $('.start_button').addClass("input_button__active")
    console.log("tot = "+total)
    
    $('.start_button').click(function(){
         console.log("gooo");
        window.location.href='quizz.html?q='+total;
    })
}
//******* END-START QUIZZ *********//


//******* QUIZZ *********//

function activeNext(){
   if($('.question_current .input_radio').is(':checked') || $('.question_current .input_checkbox').is(':checked')) { 
       console.log("it's checked"); 
       $('.question_current .input_button').addClass('input_button__active');
       
       
       $('.input_button__active').click(function(){
           if(currentQuestion<totalQuestions){
               console.log("none total");
               nextQuestion();
           }else{
                console.log("is total");
               showResults()
           }
           
       })
       
   }else{
       console.log("not checked"); 
       $('.input_button').removeClass('input_button__active');
   }
}

function nextQuestion(){
    currentQuestion ++;
    if(currentQuestion==totalQuestions-1){
        $('.question_next .input_button').replaceWith('<div class="input_button input_button__inactive connect_button">Terminer</div>');
    }
     // HIDE CURRENT QUESTION
    $('.question_current').animate({
        opacity: 0,
        left: "-=50",
      }, 250, function() {
        // Animation complete.
        $('.question_current').css("display","none");
        $('.question_current').addClass('question_prev');
        $('.question_current').removeClass('question_current');
        
         //SHOW NEXT QUESTION
        $('.question_next').css("display","flex");
        $('.question_next').css("opacity","0");
        $('.input_button__active').removeClass('input_button__active');

        $('.question_next').animate({
            opacity: 1,
            left: "-=50",
          }, 250, function() {
            $('.question_next').addClass('question_current');
            $('.question_next').removeClass('question_next');
        });
    });
}

//******* END-QUIZZ *********//







//******* RESULTS *********//

function showResults(){
    window.location.href='results.html';
}

//******* END-RESULTS *********//


