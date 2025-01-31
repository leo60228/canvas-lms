/*
 * Copyright (C) 2011 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import I18n from 'i18n!quizzes.show'
import $ from 'jquery'
import MessageStudentsDialog from 'compiled/views/MessageStudentsDialog'
import QuizArrowApplicator from 'quiz_arrows'
import inputMethods from 'quiz_inputs'
import Quiz from 'compiled/models/Quiz'
import PublishButtonView from 'compiled/views/PublishButtonView'
import QuizLogAuditingEventDumper from 'compiled/quizzes/dump_events'
import CyoeStats from 'jsx/conditional_release_stats/index'
import './jquery.instructure_date_and_time' /* dateString, time_field, datetime_field */
import 'jqueryui/dialog'
import 'compiled/jquery/fixDialogButtons'
import 'compiled/jquery.rails_flash_notifications'
import './jquery.instructure_misc_plugins' /* ifExists, confirmDelete */
import './jquery.disableWhileLoading'
import 'message_students' /* messageStudents */
import AssignmentExternalTools from 'jsx/assignments/AssignmentExternalTools'


  $(document).ready(function () {
    if(ENV.QUIZ_SUBMISSION_EVENTS_URL) {
      QuizLogAuditingEventDumper(true);
    }

    $('#preview_quiz_button').click(e => {
      $('#js-sequential-warning-dialogue div a').attr('href',$('#preview_quiz_button').attr('href'));
    });

    function ensureStudentsLoaded(callback) {
      if ($('#quiz_details').length) {
        return callback();
      } else {
        return $.get(ENV.QUIZ_DETAILS_URL, html => {
          $("#quiz_details_wrapper").html(html);
          callback();
        });
      }
    }

    var arrowApplicator = new QuizArrowApplicator();
    arrowApplicator.applyArrows();
    // quiz_show is being pulled into ember show for now. only hide inputs
    // when we don't have a .allow-inputs
    if (!$('.allow-inputs').length) {
      inputMethods.disableInputs('[type=radio], [type=checkbox]');
      inputMethods.setWidths();
    }

    $('form.edit_quizzes_quiz').on('submit', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      $(this).find('.loading').removeClass('hidden');
      var data = $(this).serializeArray();
      var url = $(this).attr('action');
      $.ajax({
        url: url,
        data: data,
        type: 'POST',
        success: function() {
          $('.edit_quizzes_quiz').parents('.alert').hide();
        }
      });
    });

    $(".delete_quiz_link").click(function(event) {
      event.preventDefault();
      var deleteConfirmMessage = I18n.t('confirms.delete_quiz', "Are you sure you want to delete this quiz?");
      var submittedCount = parseInt($('#quiz_details_wrapper').data('submitted-count'));
      if (submittedCount > 0) {
        deleteConfirmMessage += "\n\n" + I18n.t('confirms.delete_quiz_submissions_warning',
          {'one': "Warning: 1 student has already taken this quiz. If you delete it, any completed submissions will be deleted and no longer appear in the gradebook.",
           'other': "Warning: %{count} students have already taken this quiz. If you delete it, any completed submissions will be deleted and no longer appear in the gradebook."},
          {'count': submittedCount});
      }
      $("nothing").confirmDelete({
        url: $(this).attr('href'),
        message: deleteConfirmMessage,
        success: function() {
          window.location.href = ENV.QUIZZES_URL;
        }
      });
    });

    var hasOpenedQuizDetails = false;
    $(".quiz_details_link").click(event => {
      event.preventDefault();
      $("#quiz_details_wrapper").disableWhileLoading(
        ensureStudentsLoaded(() => {
          var $quizResultsText = $('#quiz_details_text');
          $("#quiz_details").slideToggle();
          if (hasOpenedQuizDetails) {
            if (ENV.IS_SURVEY) {
              $quizResultsText.text(I18n.t('links.show_student_survey_results',
                                           'Show Student Survey Results'));
            } else {
              $quizResultsText.text(I18n.t('links.show_student_quiz_results',
                                           'Show Student Quiz Results'));
            }
          } else {
            if (ENV.IS_SURVEY) {
              $quizResultsText.text(I18n.t('links.hide_student_survey_results',
                                           'Hide Student Survey Results'));
            } else {
              $quizResultsText.text(I18n.t('links.hide_student_quiz_results',
                                           'Hide Student Quiz Results'));
            }
          }
          hasOpenedQuizDetails = !hasOpenedQuizDetails;
        })
      );
    });

    $(".message_students_link").click(event => {
      event.preventDefault();
      ensureStudentsLoaded(() => {
        var submissionList = ENV.QUIZ_SUBMISSION_LIST;
        var unsubmittedStudents = submissionList.UNSUBMITTED_STUDENTS;
        var submittedStudents = submissionList.SUBMITTED_STUDENTS;
        var haveTakenQuiz = I18n.t('students_who_have_taken_the_quiz', "Students who have taken the quiz");
        var haveNotTakenQuiz = I18n.t('students_who_have_not_taken_the_quiz', "Students who have NOT taken the quiz");
        var dialog = new MessageStudentsDialog({
          context: ENV.QUIZ.title,
          recipientGroups: [
            { name: haveTakenQuiz, recipients: submittedStudents },
            { name: haveNotTakenQuiz, recipients: unsubmittedStudents }
          ]
        });
        dialog.open();
      });
    });

    $("#let_students_take_this_quiz_button").ifExists(function($link){
      var $unlock_for_how_long_dialog = $("#unlock_for_how_long_dialog");

      $link.click(() => {
        $unlock_for_how_long_dialog.dialog('open');
        return false;
      });

      var $lock_at = $(this).find('.datetime_field');

      $unlock_for_how_long_dialog.dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 400,
        buttons: {
          'Unlock' : function(){
            $('#quiz_unlock_form')
              // append this back to the form since it got moved to be a child of body when we called .dialog('open')
              .append($(this).dialog('destroy'))
              .find('#quiz_lock_at').val($lock_at.data('iso8601')).end()
              .submit();
          }
        }
      });

      $lock_at.datetime_field();
    });

    $('#lock_this_quiz_now_link').ifExists($link => {
      $link.click(e => {
        e.preventDefault();
        $('#quiz_lock_form').submit();
      })
    });

    if ($('ul.page-action-list').find('li').length > 0) {
      $('ul.page-action-list').show();
    }

    $('#publish_quiz_form').formSubmit({
      beforeSubmit: function(data) {
        $(this).find('button').attr('disabled', true).text(I18n.t('buttons.publishing', "Publishing..."));
      },
      success: function(data) {
        $(this).find('button').text(I18n.t('buttons.already_published', "Published!"));
        location.reload();
      }
    });

    var $el = $('#quiz-publish-link');
    var model = new Quiz($.extend(ENV.QUIZ, {unpublishable: !$el.hasClass("disabled")}));
    var view = new PublishButtonView({model: model, el: $el});

    var refresh = function() {
      location.href = location.href;
    }
    view.on("publish", refresh);
    view.on("unpublish", refresh);
    view.render();

    var graphsRoot = document.getElementById('crs-graphs')
    var detailsParent = document.getElementById('not_right_side')
    CyoeStats.init(graphsRoot, detailsParent)

    if ($('#assignment_external_tools').length) {
      AssignmentExternalTools.attach(
        $('#assignment_external_tools')[0],
        "assignment_view",
        parseInt(ENV.COURSE_ID, 10),
        parseInt(ENV.QUIZ.assignment_id, 10));
    }
  });
