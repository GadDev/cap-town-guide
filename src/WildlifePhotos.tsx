import { useState } from 'react';
import {
  WILDLIFE_GROUPS,
  WILDLIFE_PHOTOS,
  wildlifeSource,
  type WildlifePhoto,
} from './wildlifePhotos';
import './wildlife.css';
const byId = (id: string) => WILDLIFE_PHOTOS.find((x) => x.id === id);
function ImageCard({ photo }: { photo: WildlifePhoto }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="wildlife-photo">
      {!failed ? (
        <img
          src={'/images/wildlife/' + photo.id + '.webp'}
          alt={'Reference photograph of ' + photo.name + ' (' + photo.scientific + ')'}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="wildlife-image-unavailable">
          Image not saved on this device. See credited source.
        </div>
      )}
      <figcaption>
        <strong>{photo.name}</strong> · <i>{photo.scientific}</i>
        <small>
          © {photo.author} / {photo.license} ·{' '}
          <a href={wildlifeSource(photo.filename)} target="_blank" rel="noreferrer">
            Original photograph
          </a>
        </small>
        {photo.notes && <small>{photo.notes}</small>}
      </figcaption>
    </figure>
  );
}
export function HazardPhotos({ hazard }: { hazard: string }) {
  const ids = WILDLIFE_GROUPS[hazard] ?? [];
  return ids.length ? (
    <div className="hazard-photos">
      {ids.map((id) => {
        const p = byId(id);
        return p ? <ImageCard photo={p} key={id} /> : null;
      })}
    </div>
  ) : null;
}
export function WildlifeLegend() {
  return (
    <div className="wildlife-legend">
      <p>
        <b>Reference photographs, not an identification test.</b> Animals vary in colour, size, sex
        and age; never approach, handle or photograph a dangerous species at close range. Scorpion
        examples from other regions do not imply an animal was seen at the resort.
      </p>
      <p>
        Photographs are downloaded and bundled by the production build for offline access, with
        links to original licences. A missing image is explicitly indicated.
      </p>
    </div>
  );
}
