import './styles.css';

import AthenaLogo from './assets/athena/logo/tinker.obj';
import AthenaLogoMtl from './assets/athena/logo/obj.mtl';
import AthenaDescription from './assets/athena/description/tinker.obj';
import AthenaDescriptionMtl from './assets/athena/description/obj.mtl';
import AthenaChiffres from './assets/athena/chiffres/tinker.obj';
import AthenaChiffresMtl from './assets/athena/chiffres/obj.mtl';
import AthenaSolutions from './assets/athena/solutions/tinker.obj';
import AthenaSolutionsMtl from './assets/athena/solutions/obj.mtl';

import OpenButton from './assets/button/open/tinker.obj';
import OpenButtonMtl from './assets/button/open/obj.mtl';

import ChiffresButton from './assets/button/chiffres/tinker.obj';
import ChiffresButtonMtl from './assets/button/chiffres/obj.mtl';
import TechnosButton from './assets/button/technos/tinker.obj';
import TechnosButtonMtl from './assets/button/technos/obj.mtl';
import SolutionsButton from './assets/button/solutions/tinker.obj';
import SoluitonsButtonMtl from './assets/button/solutions/obj.mtl';

import Nexus from './assets/technos/nexus/tinker.obj';
import NexusMtl from './assets/technos/nexus/obj.mtl';
import Ansible from './assets/technos/ansible/tinker.obj';
import Artifactory from './assets/technos/artifactory/tinker.obj';
import Confluence from './assets/technos/confluence/tinker.obj';
import Docker from './assets/technos/docker/tinker.obj';
import Gitlab from './assets/technos/gitlab/tinker.obj';
import Jenkins from './assets/technos/jenkins/tinker.obj';
import AnsibleMtl from './assets/technos/ansible/obj.mtl';
import ArtifactoryMtl from './assets/technos/artifactory/obj.mtl';
import ConfluenceMtl from './assets/technos/confluence/obj.mtl';
import DockerMtl from './assets/technos/docker/obj.mtl';
import GitlabMtl from './assets/technos/gitlab/obj.mtl';
import JenkinsMtl from './assets/technos/jenkins/obj.mtl';

AFRAME.registerComponent('handle-loading', {
  schema: {
    loading: { default: true }
  },
  init() {
    const scene = this.el.sceneEl;
    const loadingContainer = document.querySelector('#loading-container');
    scene.addEventListener('realityready', () => {
      console.log('<< reality ready >>');
      this.data.loading = false;
      loadingContainer.classList.add('hidden');
    });
  }
});
AFRAME.registerComponent('athena-image-target', {
  schema: {
    name: { type: 'string' },
    found: { default: false }
  },
  init: function() {
    const object3D = this.el.object3D;
    let found = this.data.found;
    const name = this.data.name;
    object3D.visible = false;

    const showImage = ({ detail }) => {
      if (found) {
        return;
      }
      console.log('<< xrimagefound >>', detail);
      if (name != detail.name) {
        return;
      }
      object3D.position.copy(detail.position);

      // look At Camera
      const camera = document.querySelector('#camera');
      let cameraWorldPosition = new THREE.Vector3();
      camera.object3D.getWorldPosition(cameraWorldPosition);
      cameraWorldPosition.setY(detail.position.y);

      object3D.lookAt(cameraWorldPosition);

      found = true;
      object3D.visible = true;
    };

    this.el.sceneEl.addEventListener('xrimagefound', showImage);
  }
});

AFRAME.registerComponent('shadow-material', {
  init() {
    this.material = new THREE.ShadowMaterial();
    this.el.getOrCreateObject3D('mesh').material = this.material;
    this.material.opacity = 0.3;
  }
});

AFRAME.registerComponent('page-router', {
  schema: {
    currentPageId: { default: '#description-page' }
  },
  init() {
    let currentPageId = this.data.currentPageId;

    this.handleButtonClickFn = event => {
      const currentPage = document.querySelector(currentPageId);
      const clickedPageId = event.detail.page;

      console.log(
        'Current page Id: ',
        currentPageId,
        ', Clicked Page Id: ',
        clickedPageId
      );

      if (clickedPageId === currentPageId) {
        return;
      } else {
        const clickedPage = document.querySelector(clickedPageId);

        currentPage.setAttribute('scale', '0 0 0');
        clickedPage.setAttribute('scale', '1 1 1');

        currentPageId = clickedPageId;

        if (clickedPageId === '#chiffres-page') {
          const firstSphere = document.querySelector('#first-sphere');
          const secondSphere = document.querySelector('#second-sphere');
          const thirdSphere = document.querySelector('#third-sphere');

          firstSphere.emit('startOpen');
          secondSphere.emit('startOpen');
          thirdSphere.emit('startOpen');
        }
      }
    };
  },
  update() {
    this.el.addEventListener('buttonClicked', this.handleButtonClickFn);
  }
});

AFRAME.registerComponent('handle-logo-events', {
  update() {
    const pageRouter = document.querySelector('#router');
    this.el.addEventListener('click', () => {
      pageRouter.emit('buttonClicked', { page: '#description-page' });
    });
  }
});

AFRAME.registerComponent('handle-button-events', {
  init() {
    const pageRouter = document.querySelector('#router');
    const el = this.el;

    let i = 0;

    this.handleButtonClickFn = () => {
      console.log('<< ', el.id, ' clicked >>');

      // animate button
      const animation = {
        property: 'scale',
        to: '0.05 0.05 0.02',
        dur: 80,
        loop: 1,
        dir: 'alternate',
        elasticity: 1000,
        easing: 'easeOutElastic'
      };

      el.setAttribute('animation__' + i, animation);
      i++;

      pageRouter.emit('buttonClicked', {
        page: '#' + el.id.substring(7, el.id.length) + '-page'
      });
    };
  },
  update() {
    this.el.addEventListener('click', this.handleButtonClickFn);
  }
});

AFRAME.registerComponent('handle-techno-events', {
  schema: {
    x: { default: 0 },
    y: { default: 0 },
    z: { default: 0 },
    xrot: { dafault: 0 },
    yrot: { dafault: 0 },
    zrot: { dafault: 0 }
  },
  init() {
    const data = this.data;
    const camera = document.querySelector('#camera');
    const el = this.el;

    const cameraWorldPosition = new THREE.Vector3();

    this.handleOpenFn = event => {
      // store current position in data
      data.x = el.getAttribute('position').x;
      data.y = el.getAttribute('position').y;
      data.z = el.getAttribute('position').z;

      data.xrot = el.getAttribute('rotation').x;
      data.yrot = el.getAttribute('rotation').y;
      data.zrot = el.getAttribute('rotation').z;

      // get new position
      camera.object3D.getWorldPosition(cameraWorldPosition);

      const newPos = getNewPos(el, cameraWorldPosition);
      el.setAttribute('position', {
        x: data.x,
        y: data.y,
        z: data.z
      });
      el.setAttribute('visible', true);

      // set animation to move to new position
      el.setAttribute('animation__moveToCamera', {
        property: 'position',
        to: {
          x: newPos.x,
          y: newPos.y,
          z: newPos.z
        },
        dur: 500,
        easing: 'easeInQuad'
      });

      // play moving animation then pause other animations
      el.play();
      el.emit('pause');

      // look at camera
      setTimeout(() => {
        el.object3D.lookAt(cameraWorldPosition);
      }, 505);
    };

    this.handleCloseFn = event => {
      el.setAttribute('rotation', {
        x: data.xrot,
        y: data.yrot,
        z: data.zrot
      });
      // set animation to move back into original position
      el.setAttribute('animation__moveBack', {
        property: 'position',
        to: {
          x: data.x,
          y: data.y,
          z: data.z
        },
        dur: 500
      });
      el.emit('resume');
    };
  },
  update() {
    const el = this.el;
    const technoPage = document.querySelector('#technos-page');
    el.addEventListener('click', () => {
      console.log('emitting, looking for id', el.id, el.getAttribute('id'));
      technoPage.emit('technoClicked');
    });
    el.addEventListener('open', this.handleOpenFn);
    el.addEventListener('close', this.handleCloseFn);
  }
});

AFRAME.registerComponent('technos-router', {
  schema: {
    currentTechnoId: { type: 'string', default: '' }
  },
  init() {
    let currentTechnoId = this.data.currentTechnoId;
    const technoPage = document.querySelector('#technos-page');
    const contents = document.getElementById('contents');
    const container = document.getElementById('container');

    this.openCard = function() {
      let pageId, title;
      console.log(currentTechnoId);
      if (currentTechnoId === 'ansible') {
        pageId = 6712604;
        title = 'Ansible';
      } else if (currentTechnoId === 'artifactory') {
        pageId = 1102291;
        title = 'Artifactory';
      } else if (currentTechnoId === 'confluence') {
        pageId = 1421537;
        title = 'Confluence';
      } else if (currentTechnoId === 'docker') {
        pageId = 406229;
        title = 'Docker';
      } else if (currentTechnoId === 'gitlab') {
        pageId = 8578712;
        title = 'GitLab';
      } else if (currentTechnoId === 'jenkins') {
        pageId = 5260383;
        title = 'Jenkins';
      } else if (currentTechnoId === 'nexus') {
        pageId = 1102291;
        title = 'Nexus';
      }

      const apiUrl = `https://fr.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&format=json&pageids=${pageId}&origin=*`;
      let pageContent;
      fetch(apiUrl, { mode: 'cors' })
        .then(e => e.json())
        .then(data => {
          const page = data.query.pages[pageId];
          pageContent = '<h1>' + title + '</h1>' + page.extract;
          // Set the innerHTML of our UI element to the data returned by the API
          contents.innerHTML = pageContent;
          // Removing the collapsed class from container triggers a CSS transition to show the content
          container.classList.remove('collapsed');
        });
    };

    this.handleClickFn = event => {
      const clickedTechnoId = event.srcElement.id;
      const clickedTechno = document.querySelector('#' + clickedTechnoId);
      const currentTechno = currentTechnoId
        ? document.querySelector('#' + currentTechnoId)
        : '';
      console.log(
        '<< clicked techno >> (current is:',
        currentTechnoId,
        ', clicked is',
        clickedTechnoId,
        ')'
      );

      if (clickedTechnoId === currentTechnoId) {
        // si l'utilisateur ferme la techno ouverte
        // relancer l'animation
        technoPage.play();
        currentTechnoId = '';
        // fermer la techno ouverte
        clickedTechno.emit('close');
      } else {
        if (currentTechnoId === '') {
          // s'il n'y a pas de techno ouverte
          // pauser l'animation
          technoPage.pause();
        } else {
          // si l'utilisateur ouvre une techno alors qu'il y a déjà une techno ouverte
          currentTechno.emit('close');
        }
        clickedTechno.emit('open');
        currentTechnoId = clickedTechnoId;
        this.openCard();
      }
    };
  },
  update() {
    this.el.addEventListener('click', this.handleClickFn);
  }
});

AFRAME.registerComponent('handle-open-events', {
  init() {
    console.log('<< init in open component >>');
  },
  update() {
    this.el.addEventListener('click', () => {
      console.log('clicked open link');
      window.open('https://agora-t.net/b20/index.html');
    });
  }
});

/**
 * Calcule la position pour déplacer une techno vers la caméra.
 *
 * @param wrapper le wrapper de la techno à déplacer
 */
function getNewPos(wrapper, cameraPos) {
  const worldPosition = new THREE.Vector3();
  const newWorldPos = new THREE.Vector3();
  const toCamera = new THREE.Vector3();

  wrapper.object3D.getWorldPosition(worldPosition);
  // tocamera = cameraWorldPos - worldposition * 0.7
  toCamera.set(
    (cameraPos.x - worldPosition.x) * 0.6,
    (cameraPos.y - worldPosition.y) * 0.6,
    (cameraPos.z - worldPosition.z) * 0.6
  );
  wrapper.object3D.getWorldPosition(worldPosition);
  newWorldPos.addVectors(toCamera, worldPosition);

  const newPosition = wrapper.parentElement.object3D.worldToLocal(newWorldPos);
  console.log(
    '[toCamera] trying to get wrapper',
    worldPosition,
    ' to camera',
    cameraPos,
    'world new pos is',
    newWorldPos,
    'new locale position',
    newPosition
  );

  return newPosition;
}
