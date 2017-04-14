$('.item1').click(function(){
	$('.cap-bg').removeClass('animated').removeClass('flipOutY');
	$('.public-cap-bg').show();
	$('.cap-bg').addClass('animated').addClass('flipInY');

});
$('.close').click(function(){
	$('.cap-bg').removeClass('animated').removeClass('flipInY')
	$('.cap-bg').addClass('animated').addClass('flipOutY');
	var t=setTimeout(function(){
		$('.public-cap-bg').hide();
	},700)
})