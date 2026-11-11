const videoInput = document.getElementById('videoFile');
const preview = document.getElementById('preview');
const fileInfo = document.getElementById('fileInfo');
const prepareBtn = document.getElementById('prepareBtn');
const status = document.getElementById('status');
let selectedFile = null;
let previewUrl = null;

videoInput.addEventListener('change', () => {
  selectedFile = videoInput.files && videoInput.files[0] ? videoInput.files[0] : null;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  if (!selectedFile) {
    preview.hidden = true;
    fileInfo.textContent = 'No video selected yet.';
    prepareBtn.disabled = true;
    status.textContent = 'Choose a video first.';
    return;
  }
  const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
  fileInfo.textContent = `${selectedFile.name} · ${sizeMB} MB`;
  previewUrl = URL.createObjectURL(selectedFile);
  preview.src = previewUrl;
  preview.hidden = false;
  prepareBtn.disabled = false;
  status.textContent = 'Video selected. Set your languages, then prepare the project file.';
});

prepareBtn.addEventListener('click', () => {
  if (!selectedFile) return;
  const project = {
    projectName: selectedFile.name.replace(/\.[^.]+$/, ''),
    videoFileName: selectedFile.name,
    videoSizeBytes: selectedFile.size,
    sourceLanguage: document.getElementById('sourceLang').value,
    targetLanguage: document.getElementById('targetLang').value,
    keepOriginalMusicAndEffects: document.getElementById('keepMusic').checked,
    audioChunkMinutes: Number(document.getElementById('chunkLength').value),
    note: 'Project settings only. An AI dubbing backend is required to transcribe, translate, synthesize speech, synchronize audio and export a dubbed video.'
  };
  const blob = new Blob([JSON.stringify(project, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dubbing-project.json';
  a.click();
  URL.revokeObjectURL(url);
  status.textContent = 'Project settings downloaded. No video was uploaded and no dubbed video has been created yet.';
});
