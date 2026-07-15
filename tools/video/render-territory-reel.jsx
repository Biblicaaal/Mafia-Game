(function () {
  var root = 'C:/Users/Juanma/Documents/Mafia Game';
  var outputDir = root + '/video-output/territory-expansion-reel';
  var firstFrame = new File(outputDir + '/frames/frame_00001.jpg');
  var musicFile = new File('C:/Users/Juanma/Downloads/geoffharvey-sidewalk-hustle-478184.mp3');
  var outputFile = new File(outputDir + '/DeskDon_Territory_Expansion_Reel_FINAL.mp4');
  var projectFile = new File(outputDir + '/DeskDon_Territory_Expansion_Reel_FINAL.aep');
  var reportFile = new File(outputDir + '/render-report.txt');
  var captureFps = 12;
  var outputFps = 24;

  function fail(message) {
    reportFile.open('w');
    reportFile.write('FAILED\n' + message);
    reportFile.close();
    throw new Error(message);
  }

  app.beginSuppressDialogs();
  app.newProject();
  if (!firstFrame.exists) fail('First capture frame was not found: ' + firstFrame.fsName);

  var importOptions = new ImportOptions(firstFrame);
  importOptions.sequence = true;
  importOptions.forceAlphabetical = true;
  var footage = app.project.importFile(importOptions);
  footage.name = 'Desk Don Territory Capture';
  footage.mainSource.conformFrameRate = captureFps;

  var comp = app.project.items.addComp('Desk Don - Territory Expansion Reel', 720, 1280, 1, footage.duration, outputFps);
  comp.bgColor = [0.015, 0.01, 0.006];
  comp.workAreaStart = 0;
  comp.workAreaDuration = footage.duration;
  var gameLayer = comp.layers.add(footage);
  gameLayer.name = 'Vertical Gameplay Capture';
  gameLayer.startTime = 0;
  gameLayer.frameBlendingType = FrameBlendingType.FRAME_MIX;

  if (musicFile.exists) {
    var audioOptions = new ImportOptions(musicFile);
    var audio = app.project.importFile(audioOptions);
    audio.name = 'Sidewalk Hustle - Background Music';
    var audioLayer = comp.layers.add(audio);
    audioLayer.name = 'Background Jazz';
    audioLayer.startTime = 0;
    audioLayer.outPoint = Math.min(comp.duration, audio.duration);
    var levels = audioLayer.property('ADBE Audio Group').property('ADBE Audio Levels');
    if (levels) {
      levels.setValueAtTime(0, [-42, -42]);
      levels.setValueAtTime(0.7, [-14, -14]);
      levels.setValueAtTime(Math.max(0.8, comp.duration - 0.7), [-14, -14]);
      levels.setValueAtTime(comp.duration, [-42, -42]);
    }
  }

  app.project.save(projectFile);
  var queueItem = app.project.renderQueue.items.add(comp);
  queueItem.timeSpanStart = 0;
  queueItem.timeSpanDuration = comp.duration;
  var outputModule = queueItem.outputModule(1);
  outputModule.applyTemplate('H.264 - Match Render Settings - 15 Mbps');
  outputModule.file = outputFile;

  reportFile.open('w');
  reportFile.write('STARTED\nComposition: 720x1280 @ ' + outputFps + ' fps\nCapture cadence: ' + captureFps + ' fps with frame blending\nDuration: ' + comp.duration.toFixed(3) + ' seconds\nOutput: ' + outputFile.fsName);
  reportFile.close();

  app.project.renderQueue.render();

  reportFile.open('w');
  reportFile.write('COMPLETE\nComposition: 720x1280 @ ' + outputFps + ' fps\nCapture cadence: ' + captureFps + ' fps with frame blending\nDuration: ' + comp.duration.toFixed(3) + ' seconds\nOutput: ' + outputFile.fsName);
  reportFile.close();
  app.project.save(projectFile);
  app.endSuppressDialogs(false);
  app.quit();
}());
