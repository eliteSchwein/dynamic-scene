import {tsParticles, Options} from "@tsparticles/engine";

export default class ParticleHelper {
    private config = {
        "autoPlay": true,
        "background": {
            "opacity": 0
        },
        "clear": true,
        "defaultThemes": {},
        "delay": 0,
        "fullScreen": {
            "enable": false,
            "zIndex": 0
        },
        "duration": 0,
        "fpsLimit": 120,
        "interactivity": {
            "detectsOn": "window",
            "events": {
                "onClick": {
                    "enable": false
                },
                "onDiv": {
                    "enable": false
                },
                "onHover": {
                    "enable": false
                },
                "resize": {
                    "enable": false
                }
            }
        },
        "manualParticles": [],
        "particles": {
            "bounce": {
                "horizontal": {
                    "value": 1
                },
                "vertical": {
                    "value": 1
                }
            },
            "color": {
                "value": "#FFA5A5",
                "animation": {
                    "h": {
                        "count": 0,
                        "enable": false,
                        "speed": 20,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                    },
                    "s": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                    },
                    "l": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                    }
                }
            },
            "effect": {
                "close": true,
                "fill": true,
                "options": {},
                "type": {}
            },
            "groups": [],
            "move": {
                "angle": {
                    "offset": 0,
                    "value": 90
                },
                "center": {
                    "x": 50,
                    "y": 50,
                    "mode": "percent",
                    "radius": 0
                },
                "decay": 0,
                "distance": {},
                "direction": "none",
                "drift": 0,
                "enable": true,
                "outModes": {
                    "default": "out",
                    "bottom": "out",
                    "left": "out",
                    "right": "out",
                    "top": "out"
                },
                "random": false,
                "size": false,
                "speed": 3,
                "straight": false,
                "vibrate": false,
                "warp": false
            },
            "number": {
                "density": {
                    "enable": true,
                    "width": 854,
                    "height": 480
                },
                "limit": {
                    "mode": "delete",
                    "value": 0
                },
                "value": 80
            },
            "opacity": {
                "value": 0.5,
                "animation": {
                    "count": 0,
                    "enable": false,
                    "speed": 2,
                    "decay": 0,
                    "delay": 0,
                    "sync": false,
                    "mode": "auto",
                    "startValue": "random",
                    "destroy": "none"
                }
            },
            "reduceDuplicates": false,
            "shape": {
                "close": true,
                "fill": true,
                "options": {},
                "type": "circle"
            },
            "size": {
                "value": {
                    "min": 1,
                    "max": 3
                },
                "animation": {
                    "count": 0,
                    "enable": false,
                    "speed": 5,
                    "decay": 0,
                    "delay": 0,
                    "sync": false,
                    "mode": "auto",
                    "startValue": "random",
                    "destroy": "none"
                }
            },
            "stroke": {
                "width": 0
            },
            "zIndex": {
                "value": 0,
                "opacityRate": 1,
                "sizeRate": 1,
                "velocityRate": 1
            },
            "destroy": {
                "bounds": {},
                "mode": "none",
                "split": {
                    "count": 1,
                    "factor": {
                        "value": 3
                    },
                    "rate": {
                        "value": {
                            "min": 4,
                            "max": 9
                        }
                    },
                    "sizeOffset": true,
                    "particles": {}
                }
            },
            "life": {
                "count": 0,
                "delay": {
                    "value": 0,
                    "sync": false
                },
                "duration": {
                    "value": 0,
                    "sync": false
                }
            },
            "rotate": {
                "value": 0,
                "animation": {
                    "enable": false,
                    "speed": 0,
                    "decay": 0,
                    "sync": false
                },
                "direction": "clockwise",
                "path": false
            },
            "links": {
                "blink": false,
                "color": {
                    "value": "#FFA5A5"
                },
                "consent": false,
                "distance": 150,
                "enable": true,
                "frequency": 1,
                "opacity": 0.3,
                "shadow": {
                    "blur": 5,
                    "color": {
                        "value": "#000"
                    },
                    "enable": false
                },
                "triangles": {
                    "enable": false,
                    "frequency": 1
                },
                "width": 1,
                "warp": false
            },
        },
        "smooth": true,
        "zLayers": 100,
        "name": "Basic",
        "motion": {
            "disable": false,
            "reduce": {
                "factor": 4,
                "value": true
            }
        }
    }

    public async loadParticle(element: HTMLElement) {
        // @ts-ignore
        const container = await tsParticles.load({
            element: element,
            options: this.config,
        });
    }
}