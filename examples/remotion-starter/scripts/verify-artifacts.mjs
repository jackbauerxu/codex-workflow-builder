import {readFile, stat} from 'node:fs/promises';

const argumentsByName = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  argumentsByName.set(process.argv[index], process.argv[index + 1]);
}

const assertArtifact = async ({flag, expectedBytes, label}) => {
  const artifactPath = argumentsByName.get(flag);
  if (!artifactPath) {
    throw new Error(`Missing required ${flag} argument.`);
  }

  const metadata = await stat(artifactPath);
  if (metadata.size < 1024) {
    throw new Error(`${label} is unexpectedly small: ${metadata.size} bytes.`);
  }

  const signature = await readFile(artifactPath, {encoding: null});
  const actualBytes = signature.subarray(0, expectedBytes.length);
  if (!actualBytes.equals(Buffer.from(expectedBytes))) {
    throw new Error(`${label} has an invalid binary signature.`);
  }

  console.log(`${label}: ${metadata.size} bytes`);
};

await assertArtifact({
  flag: '--still',
  expectedBytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  label: 'PNG still frame'
});

const videoPath = argumentsByName.get('--video');
if (!videoPath) {
  throw new Error('Missing required --video argument.');
}
const videoMetadata = await stat(videoPath);
if (videoMetadata.size < 1024) {
  throw new Error(`MP4 render is unexpectedly small: ${videoMetadata.size} bytes.`);
}
const videoHeader = await readFile(videoPath, {encoding: null});
if (videoHeader.subarray(4, 8).toString('ascii') !== 'ftyp') {
  throw new Error('MP4 render has an invalid ftyp signature.');
}
console.log(`MP4 render: ${videoMetadata.size} bytes`);
