<!--地图组件-->
<template>
    <div name="default-map" style="height:100%;width:100%;">
        <div ref="imap" style="height: 100%; width: 100%;">

        </div>
        <IMapSwitcher v-bind:imap="imap" v-bind:option="{
                    bottom: 20,
                    right: 448,
                    initial: 'img'
                }"></IMapSwitcher>
        <div name="tool-bar" style="position:absolute;left:calc(50% - 109px);bottom:20px;">
            <IToolBar v-bind:imap="imap" :position="{}"></IToolBar>
        </div>
        <div name="left-mapcom" class="clear" style="position:absolute;left:470px;bottom:20px;">
            <ILayerManager ref="layerManager" v-bind:imap="imap" :position="{}" :showPanel="false" :height="380"></ILayerManager>
            <IMapLegend :position="{}" :showPanel="false" :height="200" style="margin-top:18px"></IMapLegend>
        </div>
    </div>
</template>
<script>
    //导入地图样式
    import '../imap/assets/imap.css';
    //导入地图对象
    import IMap from '../imap/IMap.js'
    import IMarkerLayer from '../imap/layer/IMarkerLayer.js'
    import IWMSLayer from '../imap/layer/IWMSLayer.js'
    import IOverlayLayer from '../imap/layer/IOverlayLayer.js'

    import IInfoWindow from '../imap/lib/IInfoWinfow'
    import IMarkerAnimator from '../imap/lib/IMarkerAnimator'

    import IPulseOverlay from '../imap/overlay/IPulseOverlay'
    import IPolygon from '../imap/overlay/IPolygon'

    //导入地图组件
    import IMapSwitcher from '../imap/widgets/IMapSwitcher'
    import IToolBar from '../imap/widgets/IToolBar'
    import ILayerManager from '../imap/widgets/ILayerManager'
    import IMapLegend from '../imap/widgets/IMapLegend'

    //属性弹窗
    // import CameraProp from './CameraProp'
    // import SiteProp from './SiteProp'
    // import SluiceProp from './SluiceProp'
    // import WarnProp from './WarnProp'
    // import AbnormalProp from './AbnormalProp'
    // import PeopleProp from './PeopleProp'
    // import PotralProp from './PotralProp'
    // import TotalNum from "../MobileInspection/TotalNum";

    export default {
        name: "MainMap",
        props: {
            // module: {
            //     required: true,
            //     default: 'watch'
            // }
        },
        components: {
            // TotalNum,
            IMapSwitcher,
            IToolBar,
            ILayerManager,
            IMapLegend,
            // CameraProp,
            // SiteProp,
            // SluiceProp,
            // WarnProp,
            // AbnormalProp,
            // PeopleProp,
            // PotralProp
        },
        data() {
            return {
                layer_cameras: undefined,
                layer_stations: undefined,
                layer_warnings: undefined,
                layer_abnormals: undefined,
                layer_watergates: undefined,
                layer_boundcity: undefined,
                layer_boundcounty: undefined,
                layer_river: undefined,
                layer_waterSpeed: undefined,
                layer_waterLevel: undefined,
                imap: undefined,
                olmap: undefined,
                propWinType: undefined,
                propWinprop: undefined,
                moveDataelse: {
                    x: 0,
                    y: 0
                },
            }
        },
        methods: {
            mouseDownHandleelse(event) {
                this.moveDataelse.x = event.pageX - this.$refs.winPanel.offsetLeft;
                this.moveDataelse.y = event.pageY - this.$refs.winPanel.offsetTop;
                if (event.currentTarget.style.cursor == 'move') {
                    console.log("有移动事件")
                    window.onmousemove = this.mouseMoveHandleelse;
                }
                console.log("无移动事件")
            },
            mouseMoveHandleelse(event) {
                let moveLeft = event.pageX - this.moveDataelse.x + 'px'
                let moveright = event.pageX - this.moveDataelse.x
                let moveTop = event.pageY - this.moveDataelse.y + 'px'
                let moveBottom = event.pageY - this.moveDataelse.y
                var bodywith = window.screen.availWidth;         //网页可见区域宽(body)
                var bodyheight = window.screen.availHeight;         //网页可见区域高(body)
                if (moveLeft < 0 + 'px') {
                    moveLeft = 0 + 'px'
                }
                if (moveright + 300 >= bodywith) {//300是我的容器的宽度
                    moveLeft = bodywith - 300 + 'px'
                }
                if (moveTop < 0 + 'px') {
                    moveTop = 0 + 'px'
                }
                if (moveBottom + 400 > bodyheight) {//650是我容器的高度
                    moveTop = bodyheight - 400 + 'px'
                }
                this.$refs.winPanel.style.left = moveLeft
                this.$refs.winPanel.style.top = moveTop
            },
            mouseUpHandleelse(event) {
                window.onmousemove = null
                event.currentTarget.style.cursor = 'move'
            },
            /**
             * 添加摄像头分布图层
             * */
            addCameraLayer(visible) {
                this.axios.get('./data/cameras.geojson')
                    .then((response) => {
                        var geojson = response.data;
                        if (this.layer_cameras) {
                            this.imap.removeLayer(this.layer_cameras);
                        }
                        this.layer_cameras = new IMarkerLayer(geojson, {
                            id: 'layer_cameras',
                            visible: visible,
                            renderType: 'simple',
                            img: './img/map/camera.png'
                        });
                        this.imap.addLayer(this.layer_cameras);
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            /**
             * 添加站点分布图层
             * */
            addStationLayer(visible) {
                this.axios.get('./data/stations.geojson')
                    .then((response) => {
                        var geojson = response.data;
                        if (this.layer_stations) {
                            this.imap.removeLayer(this.layer_stations);
                        }
                        this.layer_stations = new IMarkerLayer(geojson, {
                            id: 'layer_stations',
                            visible: visible,
                            renderType: 'simple',
                            img: './img/map/station.png'
                        });
                        this.imap.addLayer(this.layer_stations);
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            /**
             * 添加水闸图层
             * */
            addWaterGateLayer(visible) {
                this.axios.get('./data/watergates.geojson')
                    .then((response) => {
                        var geojson = response.data;
                        if (this.layer_watergates) {
                            this.imap.removeLayer(this.layer_watergates);
                        }
                        this.layer_watergates = new IMarkerLayer(geojson, {
                            id: 'layer_watergates',
                            visible: visible,
                            renderType: 'simple',
                            img: './img/map/watergate.png'
                        });
                        this.imap.addLayer(this.layer_watergates);
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            /**
             * 添加预警图层
             * */
            addWarningLayer(visible) {
                this.axios.get('./data/warnings.geojson')
                    .then((response) => {
                        var geojson = response.data;
                        if (this.layer_warnings) {
                            this.imap.removeLayer(this.layer_warnings);
                        }
                        this.layer_warnings = new IMarkerLayer(geojson, {
                            id: 'layer_warnings',
                            visible: visible,
                            renderType: 'simple',
                            img: './img/map/warning.png'
                        });
                        this.imap.addLayer(this.layer_warnings);
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            /**
             * 添加异常点位图层
             * */
            addAbnormalLayer(visible) {
                this.axios.get('./data/abnormals.geojson')
                    .then((response) => {
                        var geojson = response.data;
                        if (this.layer_abnormals) {
                            this.imap.removeLayer(this.layer_abnormals);
                        }
                        this.layer_abnormals = new IMarkerLayer(geojson, {
                            id: 'layer_abnormals',
                            visible: visible,
                            renderType: 'simple',
                            img: './img/map/abnormal.png'
                        });
                        this.imap.addLayer(this.layer_abnormals);
                        console.log(this.imap);
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            /**
             * 添加人员定位图层
             * */
            addScrewLocation(visible) {
                this.axios.get('./data/peoples.geojson')
                    .then((response) => {
                        var geojson = response.data;
                        if (this.layer_peoples) {
                            this.imap.removeLayer(this.layer_peoples);
                        }
                        this.layer_peoples = new IMarkerLayer(geojson, {
                            visible: visible,
                            id: 'layer_peoples',
                            renderType: 'simple',
                            img: './img/map/people.png',
                            showLabel: true,
                            labelField: 'name',
                            color: '#fff',
                            fontSize: 16,
                            labelOffset: -5
                        });
                        this.imap.addLayer(this.layer_peoples);
                    }).catch(function (error) {
                        console.log(error);
                    });
            },

            /**
             * 添加行政区划图层
             * */
            addDistrictLayer() {
                let layer_boundcity = new IWMSLayer(MapConfig.layerurl_wms, {
                    id: 'layer_boundcity',
                    extent: MapConfig.districtBound,
                    params: { 'LAYERS': 'guanqu:district_city' },
                    serverType: 'geoserver',
                });

                this.imap.addLayer(layer_boundcity);

                let layer_boundcounty = new IWMSLayer(MapConfig.layerurl_wms, {
                    id: 'layer_boundcounty',
                    extent: MapConfig.districtBound,
                    params: { 'LAYERS': 'guanqu:district_county' },
                    serverType: 'geoserver',
                });

                this.imap.addLayer(layer_boundcounty);
            },
            /**
             * 添加河流图层
             * */
            addRiverLayer() {
                let layer_river = new IWMSLayer(MapConfig.layerurl_wms, {
                    id: 'layer_river',
                    visible: false,
                    extent: [12781854.3740434944629669, 3966148.9518552357330918, 12985019.2229554522782564, 4120648.1836807653307915],
                    params: { 'LAYERS': 'guanqu:rivers' },
                    serverType: 'geoserver',
                    onClick: function (jsonStr) {
                        let json = JSON.parse(jsonStr);
                        if (json.features.length > 0) {
                            alert(json.features[0]);
                        }
                    }
                });

                this.imap.addLayer(layer_river);
            },

            /**
             * 添加水位图
             * */
            addWaterLevelLayer() {
                this.axios.get('./data/p5.geojson')
                    .then((response) => {
                        var features = response.data.features;
                        var overlayList = [];
                        for (var i = 0; i < features.length; i++) {
                            let coord = features[i].geometry.coordinates;
                            let element = this.createWaterLevelElement();
                            document.body.appendChild(element);
                            overlayList.push({
                                x: coord[0],
                                y: coord[1],
                                element: element
                            });
                        }
                        this.layer_waterLevel = new IOverlayLayer(overlayList, {
                            id: 'layer_waterLevel'
                        });
                        this.imap.addLayer(this.layer_waterLevel);
                    }).catch(function (error) {
                        console.log(error);
                    });
            },

            /**
             * 添加流速图
             * * */
            addWaterSpeedLayer() {
                this.axios.get('./data/peoples.geojson')
                    .then((response) => {
                        var features = response.data.features;
                        var overlayList = [];
                        for (var i = 0; i < features.length; i++) {
                            let coord = features[i].geometry.coordinates;
                            let element = this.createWaterSpeedElement();
                            document.body.appendChild(element);
                            overlayList.push({
                                x: coord[0],
                                y: coord[1],
                                element: element
                            });
                        }
                        this.layer_waterSpeed = new IOverlayLayer(overlayList, {
                            id: 'layer_waterSpeed'
                        });
                        this.imap.addLayer(this.layer_waterSpeed);
                    }).catch(function (error) {
                        console.log(error);
                    });
            },

            /**
             * 绑定地图的点击事件
             * */
            bindMapClick() {
                let mapClickHandler = this.olmap.on("singleclick", (evt) => {
                    //遍历每一个点击到的feature,响应事件
                    var hit = this.olmap.forEachFeatureAtPixel(evt.pixel, (feature, _layer) => {
                        if (_layer === this.layer_cameras._layer) {
                            console.log('摄像头点击');
                            console.log(feature);
                            this.propWinType = 'camera';
                            this.propWinprop = feature.getProperties();
                        } else if (_layer === this.layer_stations._layer) {
                            console.log('监测站点点击');
                            console.log(feature);
                            this.propWinType = 'station';
                            this.propWinprop = feature.getProperties();
                        } else if (_layer === this.layer_warnings._layer) {
                            console.log('预警点点击');
                            console.log(feature);
                            this.propWinType = 'warn';
                            this.propWinprop = feature.getProperties();
                            //let p3857 = feature.getGeometry().getCoordinates();
                            //let p4326 = this.imap.toLonLat(p3857);
                            //this.showWarnProp(p4326);
                        } else if (_layer === this.layer_abnormals._layer) {
                            console.log('异常点点击');
                            console.log(feature);
                            this.propWinType = 'abnormal';
                            this.propWinprop = feature.getProperties();
                        } else if (_layer === this.layer_watergates._layer) {
                            console.log('水闸点击');
                            console.log(feature);
                            this.propWinType = 'sluice';
                            this.propWinprop = feature.getProperties();
                        } else if (_layer === this.layer_peoples._layer) {
                            console.log('人员点击');
                            console.log(feature);
                            this.propWinType = 'people';
                            this.propWinprop = feature.getProperties();
                        }
                        return true;        //只响应一个事件
                    });
                });

                return mapClickHandler;
            },

            /**
             * 加载信息监视模块
             * */
            loadModuleWatch() {
                //this.unLoadModulePatrol();

                this.addCameraLayer(false);
                this.addStationLayer(false);
                this.addWarningLayer(true);
                this.addAbnormalLayer(true);
                this.addWaterGateLayer(true);
                this.addScrewLocation(false);

                this.mapClickHandler = this.bindMapClick();
            },
            unLoadModuleWatch() {
                //移除图层
                if (this.layer_cameras) {
                    this.imap.removeLayer(this.layer_cameras);
                }
                if (this.layer_stations) {
                    this.imap.removeLayer(this.layer_stations);
                }
                if (this.layer_warnings) {
                    this.imap.removeLayer(this.layer_warnings);
                }
                if (this.layer_abnormals) {
                    this.imap.removeLayer(this.layer_abnormals);
                }
                //移除图层点击事件
                if (this.mapClickHandler) {
                    this.olmap.un('singleclick', this.mapClickHandler.listener);
                }
            },
            /**
             * 加载移动巡查模块
             * */
            loadModulePatrol() {
                //this.unLoadModuleWatch();

                this.addCameraLayer(false);
                this.addStationLayer(false);
                this.addWarningLayer(true);
                this.addAbnormalLayer(true);
                this.addWaterGateLayer(false);
                this.addScrewLocation(true);

                this.mapClickHandler = this.bindMapClick();
            },
            unLoadModulePatrol() {
                //移除图层
                if (this.layer_abnormals) {
                    this.imap.removeLayer(this.layer_abnormals);
                }
                if (this.layer_peoples) {
                    this.imap.removeLayer(this.layer_peoples);
                }
                //移除图层点击事件
                if (this.mapClickHandler) {
                    this.olmap.un('singleclick', this.mapClickHandler.listener);
                }
            },

            /**
             * 显示预警信息弹窗
             * */
            //showWarnProp(position, prop) {
            //    let infoWinWarn = new IInfoWindow('这里展示预警信息', {
            //        title: '预警信息',
            //        position: position
            //    });

            //    this.imap.addInfoWindow(infoWinWarn);
            //}

            /**
             * 点击左侧菜单
             * 设置为设备信息模式
             * */
            setMode(mode) {
                let layerId = "";       //主要展示哪一个图层
                if (mode == "device") {
                    layerId = "layer_stations";
                } else if (mode == "abnormal") {
                    layerId = "layer_abnormals";
                } else if (mode == "warn") {
                    layerId = "layer_warnings";
                } else if (mode == "waterLevel") {
                    layerId = "layer_waterLevel";
                    if (!this.layer_waterLevel) {
                        this.addWaterLevelLayer();
                    }
                } else if (mode == "waterSpeed") {
                    layerId = "layer_waterSpeed";
                    if (!this.layer_waterSpeed) {
                        this.addWaterSpeedLayer();
                    }
                }
                if (layerId != "") {
                    let addedLayers = this.imap.addedLayers;
                    for (var i = 0; i < addedLayers.length; i++) {
                        if (addedLayers[i]["id"] == layerId) {
                            addedLayers[i].setVisible(true);
                        } else if (addedLayers[i]["id"] !== "layer_boundcity" && addedLayers[i]["id"] !== "layer_boundcounty") {
                            //行政区划边界不隐藏
                            addedLayers[i].setVisible(false);
                        }
                    }
                }

                this.$refs.layerManager.update();
            },

            /**
             * 创建水位分布图元素
             * */
            createWaterLevelElement() {
                let div = document.createElement('div');
                var waterLevel = (1 + Math.random()).toFixed(1);
                let rate = (waterLevel / 2) * 100;
                let color = (rate > 95 ? '#FF5454' : rate > 50 ? '#1AFC59' : '#47EDFC');

                div.innerHTML = `
                    <div style="height:172px;width:35px;background: rgba(0, 30, 57, 0.5);border: 1px solid #1C242B;padding:4px;position: absolute;left: -24px;top: -172px;
                            border-radius:0px 10px 0px 0px">
                        <div style="width:100%;height:24px;line-height:24px;text-align:center;font-size:16px;font-family: HYZhuZiMeiXinTiW;
                            font-weight: 400;font-style: italic;color: #FFFFFF;">
                            `+ waterLevel + `m
                        </div>
                        <div style="width: 100%; height: calc(100% - 24px); background: #002475;position:relative">
                            <div style="width:100%;height:`+ rate + `%;position:absolute;bottom:0px;border-top:2px solid ` + color + `;
                                background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(`+ color + `), to(#FF000000));"></div>
                        </div>
                        <div style="width:100%;height:24px;line-height:24px;position:absolute;bottom:-28px;font-size:14px;color:#ffffff;font-weight:bold">
                            1号水闸
                        </div>
                    </div>
                    `;
                return div;
            },

            /**
             * 创建流量分布图元素
             * */
            createWaterSpeedElement() {
                let div = document.createElement('div');
                var waterSpeed = (1 + Math.random()).toFixed(1);
                var rate = waterSpeed / 5;
                var length = rate * (2 * Math.PI * 24);

                div.innerHTML = `
                <div style="width:64px;height:64px;background:url('./img/map/map-speed-loca-chartbg.png');background-size:100%;">
                    <svg width="64" height="64" viewBox="0 0 64 64" style="position:absolute;top:0px;left:0px;">
                        <defs>
                            <linearGradient x1="1" y1="0" x2="0" y2="0" id="gradient1">
                                <stop offset="0%" stop-color="#4352f3"></stop>
                                <stop offset="100%" stop-color="#ab5aea"></stop>
                            </linearGradient>
                        </defs>
                        <g transform="rotate(135,32,32)">
                            <circle cx="32" cy="32" r="24" stroke-width="14" stroke="url('#gradient1')" fill="none" stroke-dasharray="`+ length + ` 1069"></circle>
                        </g>
                    </svg>
                    <div style="position:absolute;bottom:0px;width:64px;height:36px;background:url('./img/map/map-speed-loca-txtbg.png');background-size:100%;text-align:center;line-height:36px;font-size: 13px;font-family: HYZhuZiMeiXinTiW;font-weight: 400;font-style: italic;color: #FFFFFF;">
                        `+ waterSpeed + `m/s
                    </div>
                </div>`;
                return div;
            },

            /**
             * 展示巡查人员正在巡查的路径
             * */
            showPeopleNowPath() {
                this.setEmptyMap();

                this.imap.clearFeatures();

                var index = (1 + Math.random() * 10).toFixed(0);
                if (index > 10) { index = index - 10 }

                this.axios.get('./data/lines/line' + index + '.geojson')
                    .then((response) => {
                        var geosjon = response.data;

                        var features = this.imap.addGeoJsonLines(geosjon, {
                            color: "#ff0000",
                            width: 2.6
                        });

                        //在线的开始添加一个标记点
                        var sp = geosjon.features[0].geometry.coordinates[0];

                        var marker = this.imap.addMarker(sp, {
                            pname: '张起灵'
                        }, {
                            img: './img/map/people.png',
                            showLabel: true,
                            labelField: 'pname',
                            fontSize: 16,
                            labelOffset: -10,
                            color: '#ffffff'
                        });

                        this.imap.zoomToFeature(features[0], {
                            padding: [800, 800, 600, 600]
                        });

                        //开始动画
                        var markerAnimator = new IMarkerAnimator(this.imap, marker, features[0], 10);
                        markerAnimator.ended = function () {
                            markerAnimator.startAnimation();
                        }
                        markerAnimator.startAnimation();
                        this._markerAnimator = markerAnimator;

                    }).catch(function (error) {
                        console.log(error);
                    });
            },

            /**
             * 停止人员定位展示，并恢复地图到初始状态
             * */
            stopShowPeopleNowPath() {
                //清除添加的定位图标和路径
                this.imap.clearFeatures();
                //恢复初始图层显示
                if (this.module == "watch") {
                    this.loadModuleWatch();
                } else {
                    this.loadModulePatrol();
                }
                //停止动画
                if (this._markerAnimator) {
                    this._markerAnimator.stopAnimation();
                    this._markerAnimator = undefined;
                    delete this._markerAnimator;
                }

                //地图返回全图
                this.fullExtent();
            },

            /**
             * 点击左侧列表中的一项定位到一个人员
             * */
            locatePeople() {
                if (this.layer_peoples) {
                    let features = this.layer_peoples.getFeatures();
                    let count = features.length;
                    let index = Math.floor(Math.random() * (count + 1));

                    this.imap.zoomToFeature(features[index]);
                    this.propWinType = 'people';
                }
            },

            /**
             * 定位到监测站
             * */
            locateEquip() {
                if (this.layer_stations) {
                    let features = this.layer_stations.getFeatures();
                    let count = features.length;
                    let index = Math.floor(Math.random() * (count + 1));

                    this.imap.zoomToFeature(features[index]);
                    this.propWinType = 'station';
                }
            },

            /**
             * 定位到预警信息
             * */
            locateWarn() {
                if (this.layer_warnings) {
                    let features = this.layer_warnings.getFeatures();
                    let count = features.length;
                    let index = Math.floor(Math.random() * (count + 1));

                    this.imap.zoomToFeature(features[index]);
                    this.propWinType = 'warn';
                }
            },

            /**
             * 定位到异常信息
             * */
            locateAbnormal() {
                if (this.layer_abnormals) {
                    let features = this.layer_abnormals.getFeatures();
                    let count = features.length;
                    let index = Math.floor(Math.random() * (count + 1));

                    this.imap.zoomToFeature(features[index]);
                    this.propWinType = 'abnormal';
                }
            },

            /**
             * 隐藏除了区划边界外的其他图层
             * */
            setEmptyMap() {
                var addedLayers = this.imap.addedLayers;
                for (var i = 0; i < addedLayers.length; i++) {
                    if (addedLayers[i]["id"] != 'layer_boundcity' && addedLayers[i]["id"] != 'layer_boundcounty') {
                        addedLayers[i].setVisible(false);
                    }
                }
                if (this.$refs.layerManager) {
                    this.$refs.layerManager.update();
                }
            },

            /**
             * 地图返回到全图
             * */
            fullExtent() {
                this.imap.setExtent(MapConfig.initExtent, {
                    padding: [264, 0, 0, 160]
                });
            },

            /**
             * 人员属性弹窗关闭
             * */
            peoplePropClosed() {
                this.stopShowPeopleNowPath();
            },

            /**
             * 巡查轨迹弹窗关闭
             * */
            potralPropClosed() {
                this.stopShowPeopleNowPath();
            },

            /**
             * 显示巡查轨迹弹窗
             * */
            showPotralProp() {
                this.propWinType = 'potral';
                this.propWinprop = { random: Math.random() };
            },

            /**
             * 添加水闸影响范围
             * */
            showSluiceCoverExtent(params) {
                let id = params.id, coord = params.coord;
                console.log(params);
                
                let pulseOverlay = new IPulseOverlay(coord);
                this.imap.addOverlay(pulseOverlay);

                this.axios.get('./data/watergate_extent.geojson')
                    .then((response) => {
                        var geosjon = response.data;
                        let features = geosjon.features;
                        for (var i = 0; i < features.length; i++) {
                            let fId = features[i]["properties"]["id"];
                            if (fId == id) {
                                let coords = features[i]["geometry"]["coordinates"];
                                let sluiceExtent = new IPolygon(coords, {
                                    style: {
                                        strokeColor: '#ff0000',
                                        strokeWidth: 2
                                    },
                                    properties: {
                                        id: id
                                    }
                                });
                                this.imap.addOverlay(sluiceExtent);
                                this.imap.zoomToOverlay(sluiceExtent, {
                                    padding: [200, 300, 200, 300]
                                });
                                break;
                            }
                        }
                    });
            },

            /**
             * 停止显示水闸影响范围
             * */
            stopShowSluiceCoverExtent() {
                this.imap.clearOverlays();
            },
        },
        mounted() {
            this.imap = new IMap(this.$refs.imap, {
                baseMap: 'img',
                showImgLabelLayer: false
            });
            this.olmap = this.imap.map;
            window.imap=this.imap;
            //设置初始范围
            this.fullExtent();

            this.addDistrictLayer();
            this.addRiverLayer();

            if (this.module == 'watch') {
                this.loadModuleWatch();
            } else {
                this.loadModulePatrol();
            }
        },
    }
</script>
<style scoped>
    .middle-count {
        width: 900px;
        text-align: center;
        position: absolute;
        top: 88px;
        left: calc(50% - 450px);
        height: 50px;
        z-index: 10;
    }
</style>
