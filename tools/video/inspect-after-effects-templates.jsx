(function () {
  var outputFile = new File('C:/Users/Juanma/Documents/Mafia Game/video-output/ae-output-templates.txt');
  app.beginSuppressDialogs();
  app.newProject();
  var comp = app.project.items.addComp('Template Probe', 720, 1280, 1, 1, 12);
  comp.layers.addSolid([0, 0, 0], 'Probe', 720, 1280, 1, 1);
  var item = app.project.renderQueue.items.add(comp);
  var module = item.outputModule(1);
  outputFile.open('w');
  outputFile.write(module.templates.join('\n'));
  outputFile.close();
  app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
  app.endSuppressDialogs(false);
  app.quit();
}());
