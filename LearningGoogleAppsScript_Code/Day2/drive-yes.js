function listActivity() {
    var optionalArgs = {
      'source': 'drive.google.com',
      'drive.ancestorId': 'root',
      'pageSize': 10
    };
    var response = AppsActivity.Activities.list(optionalArgs);
    var activities = response.activities;
    if (activities && activities.length > 0) {
      Logger.log('Recent activity:');
      for (i = 0; i < activities.length; i++) {
        var activity = activities[i];
        var event = activity.combinedEvent;
        var user = event.user;
        var target = event.target;
        if (user == null || target == null) {
          continue;
        } else {
          var time = new Date(Number(event.eventTimeMillis));
          Logger.log('%s: %s, %s, %s (%s)', time, user.name,
                event.primaryEventType, target.name, target.mimeType);
        }
      }
    } else {
      Logger.log('No recent activity');
    }
  }
  // [END drive_activity_quickstart]