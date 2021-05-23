/**
 * @file
 * Defines Javascript behaviors for the commerce cart module.
 */

(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.cartForceRefresh = {
    attach: function (context) {
      var $form = $('form#views-form-commerce-cart-form-default-1').once('cartItemDirty');
      var $updateSubmit = $('form#views-form-commerce-cart-form-default-1 #edit-submit')
        .prop('disabled', true);

      if ($form.length) {
        $form.one('formUpdated.cartItemDirty', 'table', function () {
          var $marker = $(Drupal.theme('cartItemChangedWarning')).hide();
          $(this).addClass('changed').before($marker);
          $marker.fadeIn('slow');
        });

        $form.on('formUpdated.cartItemDirty', 'tr', function () {
          var $row = $(this);
          var marker = Drupal.theme('cartItemChangedMarker');

          $row.addClass('changed');

          var $updateSubmit = $('form#views-form-commerce-cart-form-default-1 #edit-submit')
            .prop('disabled', false);
          var $checkoutSubmit = $('form#views-form-commerce-cart-form-default-1 #edit-checkout')
            .prop('disabled', true);

          if ($row.length) {
            $row.find('td:first-child .js-form-item').append(marker);
          }
        });
      }
    },
    detach: function (context, settings, trigger) {
      if (trigger === 'unload') {
        var $form = $('form#views-form-commerce-cart-form-default-1').removeOnce('cartItemDirty');
        if ($form.length) {
          $form.off('formUpdated.cartItemDirty');
        }
      }
    }
  };
  $.extend(Drupal.theme, {
    cartItemChangedMarker: function cartItemChangedMarker() {
      return '<abbr class="warning ajax-changed" title="' + Drupal.t('Changed') + '">*</abbr>';
    },
    cartItemChangedWarning: function cartItemChangedWarning() {
      return '<div class="clearfix messages messages--warning">' +
        Drupal.theme('cartItemChangedMarker') + ' ' +
        Drupal.t('Update the cart for the changes to take effect.') + '</div>';
    }
  });
})(jQuery, Drupal, drupalSettings);
