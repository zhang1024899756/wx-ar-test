//index.js
//获取应用实例
//导入three.js库
import * as THREE from "../../libs/three.weapp";
import { OrbitControls } from "../../jsm/controls/OrbitControls";
const app = getApp();

Page({
  data: {
    canvasId: null,
    canvasWidth: 0,
    canvasHeight: 0,
    userInfo: null,
  },
  onLoad: function () {
    this.setData({ userInfo: app.globalData.userInfo });
    wx.setNavigationBarTitle({ title: "AR场景渲染3D物体" });
    //初始化Canvas对象
    this.initWebGLCanvas();
  },

  onUnload: function () {
    THREE.global.unregisterCanvas(this.data.canvasId)
  },

  //初始化Canvas对象
  initWebGLCanvas() {
    //获取页面上的标签id为webgl的对象，从而获取到canvas对象
    let query = wx.createSelectorQuery();
    query
      .select("#webgl")
      .node()
      .exec((res) => {
        let canvasId = res[0].node._canvasId
        const canvas = THREE.global.registerCanvas(canvasId, res[0].node)
        this.setData({ 
          canvasId: canvasId,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height, 
        })
        console.log("canvas.width",canvas.width)
        console.log("canvas.height",canvas.height)
        const camera = new THREE.PerspectiveCamera(70, canvas.width / canvas.height, 1, 1000);
        camera.position.z = 500;
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true, });
      
        const controls = new OrbitControls(camera, renderer.domElement);
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.25;
        // controls.enableZoom = false;
        camera.position.set(200, 200, 500);
        controls.update();
        const geometry = new THREE.BoxBufferGeometry(200, 200, 200);
      
        const texture = new THREE.TextureLoader().load(this.data.userInfo.avatarUrl)
        texture.minFilter = THREE.LinearFilter
        //const material = new THREE.MeshBasicMaterial({ map: texture });
      
        const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 })
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      
        // renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
        // renderer.setSize(canvas.width, canvas.height);
      
        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(canvas.width, canvas.height);
        }
        function render() {
          canvas.requestAnimationFrame(render);
          // mesh.rotation.x += 0.005;
          // mesh.rotation.y += 0.01;
          controls.update();
          renderer.render(scene, camera);
        }

        render()

      })
      // .exec((res) => {
      //   let canvasId = res[0].node._canvasId
      //   this.setData({ canvasId })
      //   const _canvas = THREE.global.registerCanvas(canvasId, res[0].node)
      //   this._webGLCanvas = _canvas;
      //   //获取系统信息，包括屏幕分辨率，显示区域大小，像素比等
      //   let info = wx.getSystemInfoSync();
      //   this._sysInfo = info;
      //   //设置canvas的大小，这里需要用到窗口大小与像素比乘积来定义
      //   console.log("windowHeight",this._sysInfo.windowHeight)
      //   console.log("pixelRatio",this._sysInfo.pixelRatio)
      //   this._webGLCanvas.width =
      //     this._sysInfo.windowWidth * this._sysInfo.pixelRatio;
      //   this._webGLCanvas.height =
      //     this._sysInfo.windowHeight * this._sysInfo.pixelRatio;
      //   //设置canvas的样式
      //   this._webGLCanvas.style = {};
      //   this._webGLCanvas.style.width = this._webGLCanvas.width.width;
      //   this._webGLCanvas.style.height = this._webGLCanvas.width.height;
      //   //设置显示层canvas绑定的样式style数据，页面层则直接用窗口大小来定义
      //   this.setData({
      //     canvasWidth: this._sysInfo.windowWidth,
      //     canvasHeight: this._sysInfo.windowHeight,
      //   });
      //   // 初始化WebGL场景
      //   // this.initWebGLScene();
      // });
  },

  //创建实体 ，并返回这个实体
  // createPhysical() {
  //   // 实例化一个加载器loader
  //   const loader = new THREE.TextureLoader();
  //   //加载头像为贴图
  //   const texture = new THREE.TextureLoader().load(
  //     this.data.userInfo.avatarUrl
  //   );
  //   texture.minFilter = THREE.LinearFilter
  //   //创建Cube几何体
  //   let cubeGeo = new THREE.CubeGeometry(200, 200, 200);
  //   //创建材质，
  //   //const mat = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
  //   let mat = new THREE.MeshBasicMaterial({
  //     map: texture, // 将材质的map属性设置为加载的图片
  //   });
  //   //创建Cube的Mesh对象
  //   let cube = new THREE.Mesh(cubeGeo, mat);
  //   //设置Cube对象的位置
  //   // cube.position.set(0, 0, -100);
  //   return cube
  // },

  // 初始化WebGL场景
  // initWebGLScene() {
  //   //创建摄像头
  //   let camera = new THREE.PerspectiveCamera(
  //     70,
  //     this._webGLCanvas.width / this._webGLCanvas.height,
  //     1,
  //     1000
  //   );
  //   this._camera = camera;
  //   //创建场景
  //   let scene = new THREE.Scene();
  //   this._scene = scene;
  //   //创建一个实体并设置好
  //   let Physical = this.createPhysical();
  //   //将实体加入到场景中
  //   this._scene.add(Physical);

  //   //创建渲染器,指定渲染器背景透明
  //   const renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true, });
  //   //设置渲染器大小
  //   this._renderer = renderer;
  //   this._renderer.setSize(this._webGLCanvas.width, this._webGLCanvas.height);
  //   this._renderer.setPixelRatio(this._sysInfo.devicePixelRatio);
  //   const controls = new OrbitControls(camera, renderer.domElement);
  //   this._controls = controls
  //   this._controls.update();
  //   //记录当前时间
  //   // let lastTime = Date.now();
  //   // this._lastTime = lastTime;
  //   // 控制器
  //   camera.position.set(0, 200, 500);
  //   //开始渲染
  //   this.renderWebGL();
  // },


  // 渲染函数
  // renderWebGL() {
  //   //设置帧回调函数，并且每一帧调用自定义的渲染函数
  //   this._webGLCanvas.requestAnimationFrame(this.renderWebGL);
  //   this._controls.update();
  //   //渲染执行场景，指定摄像头看到的画面
  //   this._renderer.render(this._scene, this._camera);
  // },



  touchStart(e) {
    THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
  },
  touchMove(e) {
    THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
  },
  touchEnd(e) {
    THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
  },

});
