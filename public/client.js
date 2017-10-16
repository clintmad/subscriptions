$(function () {

  $.get('/subscriptions', appendToList);

  $('form').on('submit', function (event) {
    event.preventDefault();

    var form = $(this);
    var subscriptionData = form.serialize();

    $('.alert').hide();

    $.ajax({
      type: 'POST', url: '/subscriptions', data: subscriptionData
    })
      .error(function () {
        $('.alert').show();
      })
      .success(function (subscriptionName) {
        appendToList([subscriptionName]);
        form.trigger('reset');
      });
  });

  function appendToList(subscriptions) {
    debugger

      var list = [];
      var content, subscription;
      for (var i in subscriptions) {
        subscription = subscriptions[i];
        content = '<a href="/subscriptions/' + subscription + '">' + subscription + '</a>' +
        ' <a href="#" data-subscription="' + subscription + '">' +
        '<img src="delete.png" width="15px"></a>';
        list.push($('<li>', { html: content }));
      }
      
      $('.subscription-list').append(list)
    }
  


  $('.subscription-list').on('click', 'a[data-subscription]', function (event) {
    debugger
    if (!confirm('Are you sure ?')) {
      return false;
    }

    var target = $(event.currentTarget);

    $.ajax({
      type: 'DELETE',
      url: '/subscriptions/' + target.data('subscription')
    }).done(function () {
      target.parents('li').remove();
    });
  });

});