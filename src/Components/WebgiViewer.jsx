import React, {useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect} from 'react';
import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,
    GammaCorrectionPlugin,
    addBasePlugins,
    CanvasSnipperPlugin,
    mobileAndTabletCheck
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollAnimation } from '../lib/scroll-animation';

gsap.registerPlugin(ScrollTrigger);

function WebgiViewer() {
    const canvasRef = useRef(null);

    const memorizedScrollAnimation = useCallback((position, target, onUpdate) => {
        if(position && target && onUpdate){
            scrollAnimation(position, target, onUpdate);
        }
    }, [])

    const setupViewer = useCallback(async () => {

        // Initialize the viewer
        const viewer = new ViewerApp({
            canvas: canvasRef.current,
        })
    
        // Add some plugins
        const manager = await viewer.addPlugin(AssetManagerPlugin);

        const camera = viewer.scene.activeCamera;
        const position = camera.position;
        const target = camera.target;
    
        // Add plugins individually.
        // await viewer.addPlugin(GBufferPlugin)
        // await viewer.addPlugin(new ProgressivePlugin(32))
        // await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
        // await viewer.addPlugin(GammaCorrectionPlugin)
        // await viewer.addPlugin(SSRPlugin)
        // await viewer.addPlugin(SSAOPlugin)
        // await viewer.addPlugin(DiamondPlugin)
        // await viewer.addPlugin(FrameFadePlugin)
        // await viewer.addPlugin(GLTFAnimationPlugin)
        // await viewer.addPlugin(GroundPlugin)
        // await viewer.addPlugin(BloomPlugin)
        // await viewer.addPlugin(TemporalAAPlugin)
        // await viewer.addPlugin(AnisotropyPlugin)
        // and many more...

        // or use this to add all main ones at once.
        await addBasePlugins(viewer)

        // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
        await viewer.addPlugin(CanvasSnipperPlugin)
    
        // This must be called once after all plugins are added.
        viewer.renderer.refreshPipeline();
    
        // Import and add a GLB file.
        await manager.addFromPath("scene-black.glb");

        viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false});

        window.scrollTo(0, 0);

        let needsUpdate = true;

        const onUpdate = () => {
            needsUpdate = true;
            viewer.setDirty();
        }

        viewer.addEventListener("preFrame", () => {
            camera.positionUpdated(true);
            needsUpdate = false;
        });

        memorizedScrollAnimation(position, target, onUpdate);
    
    }, []);

    useEffect(() => {
        setupViewer();
    }, []);
    
    return (
        <div id="webgi-canvas-container">
            <canvas id="webgi-canvas" ref={canvasRef}></canvas>
        </div>
    )
}

export default WebgiViewer