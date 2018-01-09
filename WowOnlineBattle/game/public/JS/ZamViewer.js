function ZamModelViewer(opts) {
    var self = this;
    if (!opts.type || !self.validTypes[opts.type]) throw "Viewer error: Bad viewer type given";
    if (!opts.container) throw "Viewer error: Bad container given";
    if (!opts.aspect) throw "Viewer error: Bad aspect ratio given";
    if (!opts.contentPath) throw "Viewer error: No content path given";
    self.type = opts.type;
    self.container = opts.container;
    self.aspect = parseFloat(opts.aspect);
    self.renderer = null;
    self.options = opts;
    var width = parseInt(self.container.width());
    var height = Math.round(width / self.aspect);
    self.init(width, height)
}
ZamModelViewer.WEBGL = 1;
ZamModelViewer.FLASH = 2;
ZamModelViewer.TOR = 1;
ZamModelViewer.WOW = 2;
ZamModelViewer.LOL = 3;
ZamModelViewer.GW2 = 4;
ZamModelViewer.WILDSTAR = 5;
ZamModelViewer.HEROES = 6;
ZamModelViewer.DESTINY = 7;
ZamModelViewer.Models = {};
ZamModelViewer.prototype = {
    validTypes: {
        2: "Wowhead",
        3: "LolKing",
        6: "HeroKing",
        7: "DestinyDB"
    },
    destroy: function() {
        var self = this;
        if (self.renderer) self.renderer.destroy();
        self.options = null;
        self.container = null
    },
    init: function(width, height) {
        var self = this,
            glSupport = false;
        if (typeof window["Uint8Array"] !== undefined && typeof window["DataView"] !== undefined) {
            try {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                if (ctx) glSupport = true
            } catch (e) {}
        }
        if (!self.options.flash && glSupport) {
            self.mode = ZamModelViewer.WEBGL;
            self.renderer = new ZamModelViewer.WebGL(self)
        } else {
            self.mode = ZamModelViewer.FLASH;
            self.renderer = new ZamModelViewer.Flash(self)
        }
        self.renderer.resize(width, height);
        self.renderer.init()
    },
    method: function(name, params) {
        var self = this;
        if (params === undefined) params = [];
        if (self.renderer) return self.renderer.method(name, [].concat(params));
        return null
    },
    option: function(key, val) {
        var self = this;
        if (val !== undefined) {
            self.options[key] = val
        }
        return self.options[key]
    }
};
ZamModelViewer.isFullscreen = function() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) return true;
    return false
};
ZamModelViewer.requestFullscreen = function(e) {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) return;
    if (e.requestFullscreen) {
        e.requestFullscreen()
    } else if (e.webkitRequestFullscreen) {
        e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    } else if (e.mozRequestFullScreen) {
        e.mozRequestFullScreen()
    } else if (e.msRequestFullscreen) {
        e.msRequestFullscreen()
    }
};
ZamModelViewer.exitFullscreen = function() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) return;
    if (document.exitFullscreen) {
        document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
    }
};
ZamModelViewer.DataView = function(buffer) {
    this.buffer = new DataView(buffer);
    this.position = 0
};
ZamModelViewer.DataView.prototype = {
    getBool: function() {
        var v = this.buffer.getUint8(this.position) != 0;
        this.position += 1;
        return v
    },
    getUint8: function() {
        var v = this.buffer.getUint8(this.position);
        this.position += 1;
        return v
    },
    getInt8: function() {
        var v = this.buffer.getInt8(this.position);
        this.position += 1;
        return v
    },
    getUint16: function() {
        var v = this.buffer.getUint16(this.position, true);
        this.position += 2;
        return v
    },
    getInt16: function() {
        var v = this.buffer.getInt16(this.position, true);
        this.position += 2;
        return v
    },
    getUint32: function() {
        var v = this.buffer.getUint32(this.position, true);
        this.position += 4;
        return v
    },
    getInt32: function() {
        var v = this.buffer.getInt32(this.position, true);
        this.position += 4;
        return v
    },
    getFloat: function() {
        var v = this.buffer.getFloat32(this.position, true);
        this.position += 4;
        return v
    },
    getString: function(len) {
        if (len === undefined) len = this.getUint16();
        var str = "";
        for (var i = 0; i < len; ++i) {
            str += String.fromCharCode(this.getUint8())
        }
        return str
    },
    setBool: function(v) {
        this.buffer.setUint8(this.position, v ? 1 : 0);
        this.position += 1
    },
    setUint8: function(v) {
        this.buffer.setUint8(this.position, v);
        this.position += 1
    },
    setInt8: function(v) {
        this.buffer.setInt8(this.position, v);
        this.position += 1
    },
    setUint16: function(v) {
        this.buffer.setUint16(this.position, v, true);
        this.position += 2
    },
    setInt16: function(v) {
        this.buffer.setInt16(this.position, v, true);
        this.position += 2
    },
    setUint32: function(v) {
        this.buffer.setUint32(this.position, v, true);
        this.position += 4
    },
    setInt32: function(v) {
        this.buffer.setInt32(this.position, v, true);
        this.position += 4
    },
    setFloat: function(v) {
        this.buffer.setFloat32(this.position, v, true);
        this.position += 4
    }
};
ZamModelViewer.WebGL = function(viewer) {
    var self = this;
    self.viewer = viewer;
    self.options = viewer.options;
    self.downloads = {};
    self.context = null;
    self.width = 0;
    self.height = 0;
    self.time = 0;
    self.delta = 0;
    self.models = [];
    self.azimuth = Math.PI * 1.5;
    self.zenith = Math.PI / 2;
    self.distance = 15;
    self.fov = 30;
    self.translation = [0, 0, 0];
    self.target = [0, 0, 0];
    self.eye = [0, 0, 0];
    self.up = [0, 0, 1];
    self.lookDir = vec3.create();
    self.fullscreen = false;
    self.projMatrix = mat4.create();
    self.viewMatrix = mat4.create();
    self.panningMatrix = mat4.create();
    self.viewOffset = vec3.create();
    if (!ZamModelViewer.WebGL.addedCss) {
        ZamModelViewer.WebGL.addedCss = true;
        $("head").append('<link rel="stylesheet" href="./files/viewer.css" type="text/css" />')
    }
};
ZamModelViewer.WebGL.prototype = {
    updateProgress: function() {
        var self = this,
            totalSize = 0,
            totalLoaded = 0;
        for (var url in self.downloads) {
            totalSize += self.downloads[url].total;
            totalLoaded += self.downloads[url].loaded
        }
        if (totalSize <= 0) {
            if (self.progressShown) {
                self.progressBg.hide();
                self.progressBar.hide();
                self.progressShown = false
            }
        } else {
            if (!self.progressShown) {
                self.progressBg.show();
                self.progressBar.show();
                self.progressShown = true
            }
            var pct = totalLoaded / totalSize;
            self.progressBar.width(Math.round(self.width * pct) + "px")
        }
    },
    destroy: function() {
        var self = this;
        self.stop = true;
        if (self.canvas) {
            self.canvas.detach();
            self.progressBg.detach();
            self.progressBar.detach();
            self.canvas.off("mousedown touchstart", self.onMouseDown).off("DOMMouseScroll", self.onMouseScroll).off("mousewheel", self.onMouseWheel).off("contextmenu", self.onContextMenu);
            $(document).off("mouseup touchend", self.onMouseUp).off("mousemove touchmove", self.onMouseMove);
            self.canvas = self.progressBg = self.progressBar = null
        }
        if (self.context) {
            var gl = self.context;
            if (self.bgTexture) gl.deleteTexture(self.bgTexture);
            self.bgTexture = null;
            if (self.program) gl.deleteProgram(self.program);
            self.program = null;
            if (self.vb) gl.deleteBuffer(self.vb);
            if (self.vs) gl.deleteShader(self.vs);
            if (self.fs) gl.deleteShader(self.fs);
            self.vb = self.vs = self.fs = null
        }
        if (self.bgImg) self.bgImg = null;
        for (var i = 0; i < self.models.length; ++i) {
            self.models[i].destroy();
            self.models[i] = null
        }
        self.models = []
    },
    method: function(name, params) {
        var self = this;
        if (self.models.length > 0 && self.models[0].external && self.models[0].external[name]) {
            return self.models[0].external[name].apply(self.models[0], params)
        } else {
            return null
        }
    },
    getTime: function() {
        if (window.performance && window.performance.now) return window.performance.now();
        else return Date.now()
    },
    draw: function() {
        var self = this,
            gl = self.context,
            i;
        var time = self.getTime();
        self.delta = (time - self.time) * .001;
        self.time = time;
        self.updateCamera();
        gl.viewport(0, 0, self.width, self.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (self.bgTexture && self.program) {
            gl.useProgram(self.program);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, self.bgTexture);
            gl.uniform1i(self.uTexture, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.enableVertexAttribArray(self.aPosition);
            gl.vertexAttribPointer(self.aPosition, 2, gl.FLOAT, false, 16, 0);
            gl.enableVertexAttribArray(self.aTexCoord);
            gl.vertexAttribPointer(self.aTexCoord, 2, gl.FLOAT, false, 16, 8);
            gl.depthMask(false);
            gl.disable(gl.CULL_FACE);
            gl.blendFunc(gl.ONE, gl.ZERO);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.enable(gl.CULL_FACE);
            gl.depthMask(true);
            gl.disableVertexAttribArray(self.aPosition);
            gl.disableVertexAttribArray(self.aTexCoord)
        }
        for (i = 0; i < self.models.length; ++i) self.models[i].draw()
    },
    updateCamera: function() {
        var self = this;
        var d = self.distance,
            a = self.azimuth,
            z = self.zenith;
        if (self.up[2] == 1) {
            self.eye[0] = -d * Math.sin(z) * Math.cos(a) + self.target[0];
            self.eye[1] = -d * Math.sin(z) * Math.sin(a) + self.target[1];
            self.eye[2] = -d * Math.cos(z) + self.target[2]
        } else {
            self.eye[0] = -d * Math.sin(z) * Math.cos(a) + self.target[0];
            self.eye[1] = -d * Math.cos(z) + self.target[1];
            self.eye[2] = -d * Math.sin(z) * Math.sin(a) + self.target[2]
        }
        vec3.subtract(self.lookDir, self.target, self.eye);
        vec3.normalize(self.lookDir, self.lookDir);
        mat4.lookAt(self.viewMatrix, self.eye, self.target, self.up);
        mat4.identity(self.panningMatrix);
        if (self.up[2] == 1) {
            vec3.set(self.viewOffset, self.translation[0], -self.translation[1], 0)
        } else {
            vec3.set(self.viewOffset, self.translation[0], 0, self.translation[1])
        }
        mat4.translate(self.panningMatrix, self.panningMatrix, self.viewOffset);
        mat4.multiply(self.viewMatrix, self.panningMatrix, self.viewMatrix)
    },
    init: function() {
        var self = this,
            gl = self.context,
            i;
        mat4.perspective(self.projMatrix, self.fov * .0174532925, self.viewer.aspect, .1, 5e3);
        self.updateCamera();
        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        if ((self.options.models || self.options.items) && ZamModelViewer.Models[self.viewer.type]) {
            var Model = ZamModelViewer.Models[self.viewer.type];
            var models = [].concat(self.options.models);
            if (models.length > 0) {
                for (i = 0; i < models.length; ++i) {
                    self.models.push(new Model(self, self.viewer, models[i], i))
                }
            } else if (self.viewer.type == ZamModelViewer.DESTINY && self.options.items) {
                self.models.push(new Model(self, self.viewer))
            }
        }

        function tick() {
            if (self.stop) return;
            requestAnimFrame(tick);
            self.draw()
        }
        tick()
    },
    resize: function(width, height) {
        var self = this;
        if (self.width === width) return;
        if (!self.fullscreen) {
            self.viewer.container.css({
                height: height + "px",
                position: "relative"
            })
        }
        self.width = width;
        self.height = height;
        if (!self.canvas) {
            self.canvas = $("<canvas/>");
            self.canvas.attr({
                width: width,
                height: height
            });
            self.viewer.container.append(self.canvas);
            self.context = self.canvas[0].getContext("webgl") || self.canvas[0].getContext("experimental-webgl");
            self.progressBg = $("<div/>", {
                css: {
                    display: "none",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "10px",
                    backgroundColor: "#000"
                }
            });
            self.progressBar = $("<div/>", {
                css: {
                    display: "none",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 0,
                    height: "10px",
                    backgroundColor: "#ccc"
                }
            });
            self.viewer.container.append(self.progressBg);
            self.viewer.container.append(self.progressBar);
            if (!self.context) {
                alert("No WebGL support, sorry! You should totally use Chrome.");
                self.canvas.detach();
                self.canvas = null;
                return
            }
            self.toggleSize = function(event) {
                if (!self.resized) {
                    self.restoreWidth = self.width;
                    self.restoreHeight = self.height;
                    self.resized = true;
                    self.resize(640, 480);
                    mat4.perspective(self.projMatrix, self.fov * .0174532925, 640 / 480, .1, 5e3)
                } else {
                    self.resized = false;
                    self.resize(self.restoreWidth, self.restoreHeight);
                    mat4.perspective(self.projMatrix, self.fov * .0174532925, self.viewer.aspect, .1, 5e3)
                }
            };
            self.onDoubleClick = function(event) {
                if (ZamModelViewer.isFullscreen()) {
                    ZamModelViewer.exitFullscreen()
                } else {
                    ZamModelViewer.requestFullscreen(self.canvas[0])
                }
            };
            self.onFullscreen = function(event) {
                if (!self.fullscreen && ZamModelViewer.isFullscreen()) {
                    self.restoreWidth = self.width;
                    self.restoreHeight = self.height;
                    self.fullscreen = true;
                    var $window = $(window);
                    self.resize($window.width(), $window.height());
                    mat4.perspective(self.projMatrix, self.fov * .0174532925, $window.width() / $window.height(), .1, 5e3)
                } else if (self.fullscreen && !ZamModelViewer.isFullscreen()) {
                    self.fullscreen = false;
                    self.resize(self.restoreWidth, self.restoreHeight);
                    mat4.perspective(self.projMatrix, self.fov * .0174532925, self.viewer.aspect, .1, 5e3)
                }
            };
            self.onMouseDown = function(event) {
                if (event.which == 3 || event.ctrlKey) {
                    self.rightMouseDown = true
                } else {
                    self.mouseDown = true
                }
                if (event.type == "touchstart") {
                    self.mouseX = event.originalEvent.touches[0].clientX;
                    self.mouseY = event.originalEvent.touches[0].clientY
                } else {
                    self.mouseX = event.clientX;
                    self.mouseY = event.clientY
                }
                $("body").addClass("unselectable")
            };
            self.onMouseScroll = function(event) {
                if (event.originalEvent.detail > 0) {
                    self.distance *= 1.25
                } else {
                    self.distance *= .75
                }
                event.preventDefault();
                return false
            };
            self.onMouseWheel = function(event) {
                if (event.originalEvent.wheelDelta < 0) {
                    self.distance *= 1.25
                } else {
                    self.distance *= .75
                }
                event.preventDefault();
                return false
            };
            self.onMouseUp = function(event) {
                if (self.mouseDown || self.rightMouseDown) {
                    $("body").removeClass("unselectable");
                    self.mouseDown = false;
                    self.rightMouseDown = false
                }
            };
            self.onMouseMove = function(event) {
                if (!self.mouseDown && !self.rightMouseDown || self.mouseX === undefined) return;
                var x, y;
                if (event.type == "touchmove") {
                    event.preventDefault();
                    x = event.originalEvent.touches[0].clientX;
                    y = event.originalEvent.touches[0].clientY
                } else {
                    x = event.clientX;
                    y = event.clientY
                }
                var dx = (x - self.mouseX) / self.width * Math.PI * 2;
                var dy = (y - self.mouseY) / self.width * Math.PI * 2;
                if (self.mouseDown) {
                    if (self.up[2] == 1) {
                        self.azimuth -= dx
                    } else {
                        self.azimuth += dx
                    }
                    self.zenith += dy;
                    var pi2 = Math.PI * 2;
                    while (self.azimuth < 0) self.azimuth += pi2;
                    while (self.azimuth > pi2) self.azimuth -= pi2;
                    if (self.zenith < 1e-4) self.zenith = 1e-4;
                    if (self.zenith >= Math.PI) self.zenith = Math.PI - 1e-4
                } else {
                    self.translation[0] += dx;
                    self.translation[1] += dy
                }
                self.mouseX = x;
                self.mouseY = y
            };
            self.onContextMenu = function(event) {
                return false
            };
            self.canvas.on("mousedown touchstart", self.onMouseDown).on("DOMMouseScroll", self.onMouseScroll).on("mousewheel", self.onMouseWheel).on("dblclick", self.onDoubleClick).on("contextmenu", self.onContextMenu);
            $(window).on("resize", self.onFullscreen);
            $(document).on("mouseup touchend", self.onMouseUp).on("mousemove touchmove", self.onMouseMove)
        } else {
            self.canvas.attr({
                width: width,
                height: height
            });
            self.canvas.css({
                width: width + "px",
                height: height + "px"
            });
            self.context.viewport(0, 0, self.drawingBufferWidth, self.drawingBufferHeight)
        }
        if (self.options.background) {
            self.loadBackground()
        }
    },
    loadBackground: function() {
        var self = this,
            gl = self.context;
        var initVb = function() {
            self.vb = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(16), gl.DYNAMIC_DRAW);
            var vs = self.compileShader(gl.VERTEX_SHADER, self.vertShader);
            var fs = self.compileShader(gl.FRAGMENT_SHADER, self.fragShader);
            var program = gl.createProgram();
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error("Error linking shaders");
                return
            }
            self.vs = vs;
            self.fs = fs;
            self.program = program;
            self.uTexture = gl.getUniformLocation(program, "uTexture");
            self.aPosition = gl.getAttribLocation(program, "aPosition");
            self.aTexCoord = gl.getAttribLocation(program, "aTexCoord")
        };
        var updateVb = function() {
            var u = self.width / self.bgImg.width,
                v = self.height / self.bgImg.height;
            var vbData = [-1, -1, 0, v, 1, -1, u, v, -1, 1, 0, 0, 1, 1, u, 0];
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vbData))
        };
        if (!self.bgImg) {
            self.bgImg = new Image;
            self.bgImg.crossOrigin = "";
            self.bgImg.onload = function() {
                self.bgImg.loaded = true;
                self.bgTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, self.bgTexture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.bgImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                if (!self.vb) initVb();
                updateVb()
            };
            self.bgImg.onerror = function() {
                self.bgImg = null
            };
            self.bgImg.src = self.options.contentPath + self.options.background
        } else if (self.bgImg.loaded) {
            if (!self.vb) initVb();
            updateVb()
        }
    },
    vertShader: "    attribute vec2 aPosition;    attribute vec2 aTexCoord;        varying vec2 vTexCoord;        void main(void) {        vTexCoord = aTexCoord;        gl_Position = vec4(aPosition, 0, 1);    }    ",
    fragShader: "    precision mediump float;    varying vec2 vTexCoord;        uniform sampler2D uTexture;        void main(void) {        gl_FragColor = texture2D(uTexture, vTexCoord);    }    ",
    compileShader: function(type, source) {
        var self = this,
            gl = self.context;
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw "Shader compile error: " + gl.getShaderInfoLog(shader)
        }
        return shader
    }
};
ZamModelViewer.Flash = function(viewer) {
    var self = this;
    self.viewer = viewer;
    self.options = viewer.options;
    self.width = 0;
    self.height = 0;
    self.div = null;
    self.object = null;
    self.divId = "sjfdlkjsfesl32"
};
ZamModelViewer.Flash.prototype = {
    destroy: function() {
        var self = this;
        if (self.div) {
            self.div.detach();
            self.div = null
        }
        if (self.object) {
            self.object.detach();
            self.object = null
        }
    },
    method: function(name, params) {
        var self = this,
            object = $("#" + self.divId);
        if (object.length > 0) {
            return object[0][name].apply(object[0], params)
        } else {
            return null
        }
    },
    resize: function(width, height) {
        var self = this;
        if (self.width === width) return;
        self.viewer.container.css({
            height: height + "px"
        });
        self.width = width;
        self.height = height;
        if (!self.div) {
            self.div = $("<div/>", {
                id: self.divId
            });
            self.viewer.container.append(self.div)
        }
    },
    init: function() {
        var self = this,
            opts = self.options;
        var model = opts.models;
        var flashVars = {
            modelType: model.type,
            model: model.id,
            container: self.divId,
            contentPath: opts.contentPath
        };
        var params = {
            quality: "high",
            allowscriptaccess: "always",
            allowfullscreen: true,
            menu: false,
            bgcolor: "#181818",
            wmode: "direct"
        };
        if (opts.background) flashVars.background = opts.background;
        if (opts.cls !== undefined) flashVars.cls = opts.cls;
        if (opts.hd !== undefined) flashVars.hd = opts.hd;
        if (opts.sk !== undefined) flashVars.sk = opts.sk;
        if (opts.ha !== undefined) flashVars.ha = opts.ha;
        if (opts.hc !== undefined) flashVars.hc = opts.hc;
        if (opts.fa !== undefined) flashVars.fa = opts.fa;
        if (opts.fc !== undefined) flashVars.fc = opts.fc;
        if (opts.fh !== undefined) flashVars.fh = opts.fh;
        if (opts.items) {
            var items = opts.items;
            var equipList = [];
            if ($.isArray(items)) {
                for (var i = 0; i < items.length; ++i) {
                    equipList.push(items[i][0]);
                    equipList.push(items[i][1])
                }
            } else {
                for (var slot in items) {
                    equipList.push(slot);
                    equipList.push(items[slot])
                }
            }
            flashVars.equipList = equipList.join(",")
        }
        swfobject.embedSWF(flashVars.contentPath + "ZAMviewerfp11.swf", self.divId, self.width, self.height, "11.0.0", undefined, flashVars, params, {});
        self.object = $("#" + self.divId);
        if (!self.object.length) self.object = null
    }
};
ZamModelViewer.Wow = function() {};
ZamModelViewer.Wow.Model = function(renderer, viewer, model, index, skipLoad) {
    var self = this;
    self.Texture = ZamModelViewer.Wow.Texture;
    self.renderer = renderer;
    self.viewer = viewer;
    self.model = model;
    self.modelIndex = index;
    self.modelPath = null;
    self.loaded = false;
    self.opts = self.viewer.options;
    self.mount = null;
    self.isMount = self.opts.mount && self.opts.mount.type == ZamModelViewer.Wow.Types.NPC && self.opts.mount.id == self.model.id;
    if (self.model.type == ZamModelViewer.Wow.Types.CHARACTER) {
        if (self.opts.mount && self.opts.mount.type == ZamModelViewer.Wow.Types.NPC && self.opts.mount.id) {
            self.opts.mount.parent = self;
            self.mount = new ZamModelViewer.Wow.Model(renderer, viewer, self.opts.mount, 0)
        }
    }
    self.race = -1;
    self.gender = -1;
    self.class = self.opts.cls ? parseInt(self.opts.cls) : -1;
    self.meta = null;
    self.skinIndex = 0;
    self.hairIndex = 0;
    self.hairColorIndex = 0;
    self.faceIndex = 0;
    self.faceFeatureIndex = 0;
    self.faceColorIndex = 0;
    self.hairVis = true;
    self.faceVis = true;
    self.hairMesh = null;
    self.parent = self.model.parent || null;
    self.items = {};
    self.needsCompositing = false;
    self.textureOverrides = {};
    self.compositeImage = null;
    self.compositeTexture = null;
    self.npcTexture = null;
    self.specialTextures = {};
    self.bakedTextures = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    self.isHD = false;
    self.numGeosets = 21;
    self.geosets = new Array(self.numGeosets);
    self.time = 0;
    self.frame = 0;
    self.animationList = null;
    self.currentAnimation = null;
    self.animStartTime = 0;
    self.slotAttachments = {};
    self.matrix = mat4.create();
    self.vbData = null;
    self.vb = null;
    self.ib = null;
    self.shaderReady = false;
    self.vs = null;
    self.fs = null;
    self.program = null;
    self.uniforms = null;
    self.attribs = null;
    self.ambientColor = [.35, .35, .35, 1];
    self.primaryColor = [1, 1, 1, 1];
    self.secondaryColor = [.35, .35, .35, 1];
    self.lightDir1 = vec3.create();
    self.lightDir2 = vec3.create();
    self.lightDir3 = vec3.create();
    vec3.normalize(self.lightDir1, [5, -3, 3]);
    vec3.normalize(self.lightDir2, [5, 5, 5]);
    vec3.normalize(self.lightDir3, [-5, -5, -5]);
    self.boundsSet = false;
    self.animBounds = false;
    self.boundsMin = [0, 0, 0];
    self.boundsMax = [0, 0, 0];
    self.boundsCenter = [0, 0, 0];
    self.boundsSize = [0, 0, 0];
    self.vertices = null;
    self.indices = null;
    self.animations = null;
    self.animLookup = null;
    self.bones = null;
    self.boneLookup = null;
    self.keyBoneLookup = null;
    self.meshes = null;
    self.texUnits = null;
    self.texUnitLookup = null;
    self.renderFlags = null;
    self.materials = null;
    self.materialLookup = null;
    self.textureAnims = null;
    self.textureAnimLookup = null;
    self.textureReplacements = null;
    self.attachments = null;
    self.attachmentLookup = null;
    self.colors = null;
    self.alphas = null;
    self.alphaLookup = null;
    self.particleEmitters = null;
    self.ribbonEmitters = null;
    self.skins = null;
    self.faces = null;
    self.hairs = null;
    self.tmpMat = mat4.create();
    self.tmpVec = vec3.create();
    self.tmpVec3 = vec3.create();
    self.tmpVec4 = vec4.create();
    self.mountMat = mat4.create();
    if (!skipLoad) {
        self.load()
    }
};
ZamModelViewer.Models[ZamModelViewer.WOW] = ZamModelViewer.Wow.Model;
ZamModelViewer.Wow.Model.prototype = {
    external: {
        getNumAnimations: function() {
			console.log("calling getNumAnimations")
            var model = this.mount ? this.mount : this;
            return model.animations ? model.animations.length : 0
        },
        getAnimation: function(idx) {
            var model = this.mount ? this.mount : this;
            if (model.animations && idx > -1 && idx < model.animations.length) {
                return model.animations[idx].name
            } else {
                return ""
            }
        },
        setAnimation: function(name) {
            var model = this.mount ? this.mount : this;
            model.setAnimation(name)
        },
        resetAnimation: function() {
            var model = this.mount ? this.mount : this;
            model.setAnimation("Stand")
        },
        attachList: function(list) {
            var equip = list.split(",");
            var items = [];
            for (var i = 0; i < equip.length; i += 2) {
                items.push([equip[i], equip[i + 1]])
            }
            this.loadItems(items);
            this.needsCompositing = true;
            this.setup()
        },
        clearSlots: function(list) {
            /*var slots = list.split(",");
            for (var i = 0; i < slots.length; ++i) {
                this.removeSlot(slots[i])
            }*/
			for(var i=0; i<20; ++i){
				this.removeSlot(i)
			}
            this.needsCompositing = true;
            this.setup()
        },
        setAppearance: function(hairStyle, hairColor, faceType, skinColor, features, featuresColor) {
            this.skinIndex = skinColor;
            this.hairIndex = hairStyle;
            this.hairColorIndex = hairColor;
            this.faceIndex = faceType;
            this.faceFeatureIndex = features;
            this.faceColorIndex = featuresColor;
            var Region = ZamModelViewer.Wow.Regions;
            var destroyTexture = function(array, key) {
                array[key].destroy();
                delete array[key]
            };
            if (this.specialTextures[1]) destroyTexture(this.specialTextures, 1);
            if (this.specialTextures[6]) destroyTexture(this.specialTextures, 6);
            if (this.specialTextures[8]) destroyTexture(this.specialTextures, 8);
            if (this.bakedTextures[Region.LegUpper][1]) destroyTexture(this.bakedTextures[Region.LegUpper], 1);
            if (this.bakedTextures[Region.TorsoUpper][1]) destroyTexture(this.bakedTextures[Region.TorsoUpper], 1);
            if (this.bakedTextures[Region.FaceLower][1]) destroyTexture(this.bakedTextures[Region.FaceLower], 1);
            if (this.bakedTextures[Region.FaceUpper][1]) destroyTexture(this.bakedTextures[Region.FaceUpper], 1);
            if (this.bakedTextures[Region.FaceLower][2]) destroyTexture(this.bakedTextures[Region.FaceLower], 2);
            if (this.bakedTextures[Region.FaceUpper][2]) destroyTexture(this.bakedTextures[Region.FaceUpper], 2);
            if (this.bakedTextures[Region.FaceLower][3]) destroyTexture(this.bakedTextures[Region.FaceLower], 3);
            if (this.bakedTextures[Region.FaceUpper][3]) destroyTexture(this.bakedTextures[Region.FaceUpper], 3);
            this.needsCompositing = true;
            this.setup()
        },
        isLoaded: function() {
            if (this.mount) {
                return this.mount.loaded && this.loaded
            } else {
                return this.loaded
            }
        }
    },
    setMatrix: function(parent, bone, attach, extra) {
        var self = this;
        mat4.copy(self.matrix, parent);
        mat4.multiply(self.matrix, self.matrix, bone);
        if (attach) mat4.translate(self.matrix, self.matrix, attach);
        if (extra) mat4.multiply(self.matrix, self.matrix, extra)
    },
    updateBuffers: function(fillVb) {
        var self = this,
            i, j, vertLength = 8,
            gl = self.renderer.context;
        if (!self.vertices || !self.indices) return;
        var vbLength = self.vertices.length * vertLength;
        if (!self.vbData) self.vbData = new Float32Array(vbLength);
        if (fillVb) {
            var vbData = self.vbData,
                verts = self.vertices;
            for (i = 0, j = 0; i < vbLength; ++j) {
                vbData[i + 0] = verts[j].transPosition[0];
                vbData[i + 1] = verts[j].transPosition[1];
                vbData[i + 2] = verts[j].transPosition[2];
                vbData[i + 3] = verts[j].transNormal[0];
                vbData[i + 4] = verts[j].transNormal[1];
                vbData[i + 5] = verts[j].transNormal[2];
                vbData[i + 6] = verts[j].u;
                vbData[i + 7] = verts[j].v;
                i += 8
            }
        }
        if (!self.vb) {
            self.vb = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
            gl.bufferData(gl.ARRAY_BUFFER, self.vbData, gl.DYNAMIC_DRAW);
            self.ib = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.ib);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(self.indices), gl.STATIC_DRAW)
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, self.vbData)
        }
    },
    updateBounds: function() {
        var self = this,
            t, m, color = [1, 1, 1, 1],
            Wow = ZamModelViewer.Wow;
        var min = self.boundsMin,
            max = self.boundsMax,
            pos, tmp = self.tmpVec;
        vec3.set(min, 9999, 9999, 999);
        vec3.set(max, -9999, -9999, -9999);
        if (!self.texUnits) {
            mat4.identity(self.matrix);
            self.renderer.distance = 1;
            return false
        }
        for (var i = 0; i < self.texUnits.length; ++i) {
            t = self.texUnits[i];
            if (!t.show) continue;
            color[0] = color[1] = color[2] = color[3] = 1;
            if (self.currentAnimation) {
                if (t.color) t.color.getValue(self.currentAnimation.index, self.time, color);
                if (t.alpha) color[3] *= t.alpha.getValue(self.currentAnimation.index, self.time)
            }
            if (color[3] < .01) continue;
            m = t.mesh;
            for (var j = 0; j < m.indexCount; ++j) {
                pos = self.vertices[self.indices[m.indexStart + j]].transPosition;
                vec3.min(min, min, pos);
                vec3.max(max, max, pos)
            }
        }
        if (self.mount && self.mount.loaded) {
            if (self.mount.updateBounds()) {
                vec3.copy(min, vec3.scale(min, self.mount.boundsMin, 1.1));
                vec3.copy(max, vec3.scale(max, self.mount.boundsMax, 1.1));
                max[2] *= 1.75
            }
        }
        if (self.model.type == Wow.Types.NPC) {
            vec3.scale(min, min, self.meta.Scale);
            vec3.scale(max, max, self.meta.Scale)
        }
        vec3.subtract(self.boundsSize, max, min);
        vec3.scaleAndAdd(self.boundsCenter, min, self.boundsSize, .5);
        var hSize = self.boundsSize[2],
            wSize, dSize, scale = self.meta.Scale ? self.meta.Scale : 1;
        if (self.model.type != Wow.Types.ITEM) {
            wSize = self.boundsSize[1];
            dSize = self.boundsSize[0]
        } else {
            wSize = self.boundsSize[0];
            dSize = self.boundsSize[1]
        }
        if (!self.parent) {
            var ratio = self.renderer.width / self.renderer.height;
            var hTan = 2 * Math.tan(self.renderer.fov / 2 * .0174532925);
            var wTan = hTan * ratio;
            var hDist = hSize * 1.2 / hTan;
            var wDist = wSize * 1.2 / wTan;
            self.renderer.distance = Math.max(Math.max(hDist, wDist), dSize * 2)
        }
        mat4.identity(self.matrix);
        if (self.model.type != Wow.Types.ITEM) {
            mat4.rotateZ(self.matrix, self.matrix, Math.PI / 2)
        }
        mat4.translate(self.matrix, self.matrix, vec3.negate(tmp, self.boundsCenter));
        vec3.set(self.tmpVec, scale, scale, scale);
        mat4.scale(self.matrix, self.matrix, self.tmpVec);
        return true
    },
    disabledMeshes: {
        "item/objectcomponents/weapon/knife_1h_outlandraid_d_01.mo3": {
            1: true
        },
        "creature/cat/spectralcat.mo3": {
            1: true
        }
    },
    setup: function() {
        var self = this,
            i, Wow = ZamModelViewer.Wow;
        if (self.model.type != Wow.Types.CHARACTER && self.model.type != Wow.Types.NPC && self.model.type != Wow.Types.HUMANOIDNPC || self.race < 1) {
            if (self.texUnits) {
                if (self.modelPath == "creature/saberon/saberon.mo3") {
                    for (i = 0; i < self.texUnits.length; ++i) {
                        self.texUnits[i].show = self.texUnits[i].meshId == 0
                    }
                } else if (self.disabledMeshes[self.modelPath] !== undefined) {
                    var mesh = self.disabledMeshes[self.modelPath];
                    for (i = 0; i < self.texUnits.length; ++i) {
                        self.texUnits[i].show = mesh[i] === undefined
                    }
                } else {
                    for (i = 0; i < self.texUnits.length; ++i) {
                        self.texUnits[i].show = true
                    }
                }
            }
            return
        }
        if ((self.race == Wow.Races.BROKEN || self.race == Wow.Races.TUSKARR) && self.hairIndex == 0) {
            self.hairIndex = 1
        }
        if (self.model.type == Wow.Types.CHARACTER && self.race == Wow.Races.DWARF && self.opts.fh == undefined) {
            self.faceFeatureIndex = 3
        }
        var skin, face, features, featureTexture, hair, hairTexture, dk = self.class == Wow.Classes.DEATHKNIGHT;
        var skins = Wow.Skin.GetSkins(self.skins, true, dk),
            faces, textures;
        if (skins) {
            if (self.skinIndex >= skins.length) self.skinIndex = 0;
            if (self.skinIndex < skins.length) skin = skins[self.skinIndex];
            if (skin) {
                if (false && dk) {
                    faces = Wow.Skin.GetFaces(skin.faces, true, dk, skin.skinFlags);
                    if (self.faceIndex >= faces.length) self.faceIndex = 0;
                    if (self.faceIndex < faces.length) face = faces[self.faceIndex]
                } else if (self.faceIndex < skins.length) {
                    faces = Wow.Skin.GetFaces(skins[self.faceIndex].faces, true, dk, 0);
                    var index = self.skinIndex;
                    if (index >= faces.length) index = 0;
                    if (index < faces.length) face = faces[index]
                }
            }
        }
        if (self.faces) {
            if (self.faceFeatureIndex >= self.faces.length) self.faceFeatureIndex = 0;
            if (self.faceFeatureIndex < self.faces.length) features = self.faces[self.faceFeatureIndex];
            if (features) {
                textures = Wow.Face.GetTextures(features.textures, true, dk);
                if (self.faceColorIndex >= textures.length) self.faceColorIndex = 0;
                if (self.faceColorIndex < textures.length) featureTexture = textures[self.faceColorIndex]
            }
        }
        if (self.hairs) {
            if (self.hairIndex >= self.hairs.length) self.hairIndex = 0;
            if (self.hairIndex < self.hairs.length) hair = self.hairs[self.hairIndex];
            if (hair) {
                textures = Wow.Hair.GetTextures(hair.textures, true, dk);
                if (self.hairColorIndex >= textures.length) self.hairColorIndex = 0;
                if (self.hairColorIndex < textures.length) hairTexture = textures[self.hairColorIndex]
            }
        }
        var Region = ZamModelViewer.Wow.Regions;
        if (!self.npcTexture) {
            self.needsCompositing = true;
            if (skin) {
                if (skin.base && !self.specialTextures[1]) self.specialTextures[1] = new self.Texture(self, 1, skin.base);
                if (skin.panties && !self.bakedTextures[Region.LegUpper][1]) self.bakedTextures[Region.LegUpper][1] = new self.Texture(self, Region.LegUpper, skin.panties);
                if (skin.bra && !self.bakedTextures[Region.TorsoUpper][1]) self.bakedTextures[Region.TorsoUpper][1] = new self.Texture(self, Region.TorsoUpper, skin.bra)
            }
            if (face) {
                if (face.lower && !self.bakedTextures[Region.FaceLower][1]) self.bakedTextures[Region.FaceLower][1] = new self.Texture(self, Region.FaceLower, face.lower);
                if (face.upper && !self.bakedTextures[Region.FaceUpper][1]) self.bakedTextures[Region.FaceUpper][1] = new self.Texture(self, Region.FaceUpper, face.upper)
            }
            if (featureTexture) {
                if (featureTexture.lower && !self.bakedTextures[Region.FaceLower][2]) self.bakedTextures[Region.FaceLower][2] = new self.Texture(self, Region.FaceLower, featureTexture.lower);
                if (featureTexture.upper && !self.bakedTextures[Region.FaceUpper][2]) self.bakedTextures[Region.FaceUpper][2] = new self.Texture(self, Region.FaceUpper, featureTexture.upper)
            }
            if (hairTexture) {
                if (hairTexture.lower && !self.bakedTextures[Region.FaceLower][3]) self.bakedTextures[Region.FaceLower][3] = new self.Texture(self, Region.FaceLower, hairTexture.lower);
                if (hairTexture.upper && !self.bakedTextures[Region.FaceUpper][3]) self.bakedTextures[Region.FaceUpper][3] = new self.Texture(self, Region.FaceUpper, hairTexture.upper)
            }
        }
        if (skin && skin.fur && !self.specialTextures[8]) self.specialTextures[8] = new self.Texture(self, 8, skin.fur);
        if (hairTexture && hairTexture.texture && !self.specialTextures[6]) self.specialTextures[6] = new self.Texture(self, 6, hairTexture.texture);
        else if (hairTexture && !hairTexture.texture && !self.specialTextures[6] && self.hairIndex == 0 && self.hairs.length > 1) {
            hair = self.hairs[1];
            if (self.hairColorIndex >= hair.textures.length) self.hairColorIndex = 0;
            if (self.hairColorIndex < hair.textures.length) {
                hairTexture = hair.textures[self.hairColorIndex];
                if (hairTexture.texture) self.specialTextures[6] = new self.Texture(self, 6, hairTexture.texture)
            }
        }
        self.updateMeshes()
    },
    updateMeshes: function() {
        var self = this,
            i, j, u, Wow = ZamModelViewer.Wow,
            Races = Wow.Races,
            Genders = Wow.Genders,
            Slots = Wow.Slots;
        if (!self.texUnits || self.texUnits.length == 0) return;
        var showHair = true;
        if (self.hairMesh) showHair = self.hairMesh.show;
        for (i = 0; i < self.texUnits.length; ++i) {
            self.texUnits[i].show = self.texUnits[i].meshId == 0
        }
        for (i = 0; i < self.numGeosets; ++i) {
            self.geosets[i] = 1
        }
        self.geosets[7] = 2;
        if (self.faceVis) {
            if (self.faces && self.faceFeatureIndex < self.faces.length) {
                var face = self.faces[self.faceFeatureIndex];
                self.geosets[1] = face.geoset1;
                self.geosets[2] = face.geoset2;
                self.geosets[3] = face.geoset3
            }
        }
        if (self.race == Races.GOBLIN) {
            if (self.geosets[1] == 1) self.geosets[1] = 2;
            if (self.geosets[2] == 1) self.geosets[2] = 2;
            if (self.geosets[3] == 1) self.geosets[3] = 2
        }
        var slot, item, hasRobe = false,
            hasBoots = false,
            hasHelm = false;
        for (slot in self.items) {
            item = self.items[slot];
            if (item.slot == Slots.ROBE) hasRobe = true;
            else if (item.slot == Slots.BOOTS) hasBoots = true;
            else if (item.slot == Slots.HEAD) hasHelm = true;
            if (!item.geosets) continue;
            for (j = 0; j < item.geosets.length; ++j) {
                self.geosets[item.geosets[j].index] = item.geosets[j].value
            }
            if (self.geosets[13] == 1) self.geosets[13] += item.geoC;
            if (item.slot == Slots.BELT) self.geosets[18] = 1 + item.geoA;
            if (self.race == Races.PANDAREN && item.slot == Slots.PANTS) self.geosets[14] = 0
        }
        if (self.geosets[13] == 2) self.geosets[5] = self.geosets[12] = 0;
        if (self.geosets[4] > 1) self.geosets[8] = 0;
        if (self.isHD && hasBoots) self.geosets[20] = 2;
        if (!hasHelm) {
            showHair = true;
            self.hairVis = self.faceVis = true
        } else {
            showHair = self.hairVis
        }
        if (self.hairs && self.hairIndex < self.hairs.length) {
            self.hairMesh = null;
            var hair = self.hairs[self.hairIndex];
            for (i = 0; i < self.texUnits.length; ++i) {
                u = self.texUnits[i];
                if (u.meshId != 0 && u.meshId == hair.geoset) {
                    u.show = true;
                    self.hairMesh = u
                }
            }
        }
        var a, b;
        for (i = 0; i < self.texUnits.length; ++i) {
            u = self.texUnits[i];
            if (self.race != Races.HUMAN && !((self.race == Races.DRAENEI || self.race == Races.SCOURGE) && self.gender == Genders.FEMALE) && u.meshId == 0 && u.mesh.indexCount < 36) {
                u.show = false;
                continue
            }
            if (u.meshId == 1 && (!self.hairVis || self.gender == Genders.MALE && self.hairIndex == 0 && (self.race == Races.HUMAN || self.race == Races.GNOME || self.race == Races.TROLL))) {
                u.show = true
            }
            for (j = 1; j < self.numGeosets; ++j) {
                a = j * 100;
                b = (j + 1) * 100;
                if (u.meshId > a && u.meshId < b) u.show = u.meshId == a + self.geosets[j]
            }
            if (self.race == Races.SCOURGE && !self.isHD) {
                if (self.gender == Genders.FEMALE) {
                    if (u.mesh == 49 || u.mesh == 51) u.show = true
                } else {
                    if (u.mesh == 62) u.show = true
                }
            } else if (self.race == Races.GOBLIN) {
                if (self.gender == Genders.FEMALE && u.mesh == 0 || self.gender == Genders.MALE && u.mesh == 3) u.show = false
            } else if (self.race == Races.WORGEN) {
                if (self.gender == Genders.MALE) {
                    if (u.mesh == 5 || u.mesh == 3 || u.mesh >= 36 && u.mesh <= 47) u.show = false
                } else {
                    if (u.mesh == 2 || u.mesh == 3 || u.mesh >= 58 && u.mesh <= 69) u.show = false
                }
            } else if (self.race == Races.PANDAREN) {
                if (self.gender == Genders.FEMALE) {
                    if (hasRobe && u.meshId == 1401) u.show = false
                }
            } else if (self.race == Races.NIGHTELF) {
                if (self.class != Wow.Classes.DEATHKNIGHT && u.meshId == 1702) u.show = true
            }
            if (self.class == Wow.Classes.DEATHKNIGHT) {
                if (u.meshId == 1703) u.show = true
            }
        }
        var attach;
        for (slot in self.items) {
            item = self.items[slot];
            if (!item.models) continue;
            for (i = 0; i < item.models.length; ++i) {
                if (self.slotAttachments[item.slot] && self.slotAttachments[item.slot].length > i) {
                    attach = self.attachments[self.slotAttachments[item.slot][i]];
                    item.models[i].bone = attach.bone;
                    item.models[i].attachment = attach
                }
            }
        }
        if (self.hairMesh) self.hairMesh.show = showHair && self.hairVis
    },
    compositeTextures: function() {
        var self = this,
            i, j, Region = ZamModelViewer.Wow.Regions,
            Slots = ZamModelViewer.Wow.Slots,
            Races = ZamModelViewer.Wow.Races,
            item, t;
        for (i = 0; i < 11; ++i) {
            for (j in self.bakedTextures[i]) {
                if (!self.bakedTextures[i][j].ready()) return
            }
        }
        for (i in self.items) {
            item = self.items[i];
            if (!item.loaded) {
                return
            } else if (item.textures) {
                for (j = 0; j < item.textures.length; ++j) {
                    if (item.textures[j].texture && !item.textures[j].texture.ready()) return
                }
            }
        }
        if (!self.specialTextures[1] || !self.specialTextures[1].ready()) return;
        if (!self.compositeImage) {
            self.compositeImage = document.createElement("canvas");
            self.compositeImage.width = self.specialTextures[1].img.width;
            self.compositeImage.height = self.specialTextures[1].img.height
        }
        var ctx = self.compositeImage.getContext("2d");
        ctx.drawImage(self.specialTextures[1].img, 0, 0, self.compositeImage.width, self.compositeImage.height);
        var w = self.compositeImage.width,
            h = self.compositeImage.height,
            regions = Region.old,
            r;
        if (w != h) regions = Region.new;
        for (i = 1; i <= 3; ++i) {
            if (self.bakedTextures[Region.FaceLower][i]) {
                if (!self.bakedTextures[Region.FaceLower][i].mergeImages()) return;
                r = regions[Region.FaceLower];
                ctx.drawImage(self.bakedTextures[Region.FaceLower][i].mergedImg, w * r.x, h * r.y, w * r.w, h * r.h)
            }
            if (self.bakedTextures[Region.FaceUpper][i]) {
                if (!self.bakedTextures[Region.FaceUpper][i].mergeImages()) return;
                r = regions[Region.FaceUpper];
                ctx.drawImage(self.bakedTextures[Region.FaceUpper][i].mergedImg, w * r.x, h * r.y, w * r.w, h * r.h)
            }
        }
        if (self.isHD) {
            for (i = 2; i <= 3; ++i) {
                if (self.bakedTextures[Region.FaceLower][i]) {
                    if (!self.bakedTextures[Region.FaceLower][i].mergeImages()) return;
                    r = regions[Region.FaceLower2];
                    ctx.drawImage(self.bakedTextures[Region.FaceLower][i].mergedImg, w * r.x, h * r.y, w * r.w, h * r.h)
                }
            }
        }
        var drawBra = true,
            drawPanties = true,
            uniqueSlot;
        for (i in self.items) {
            uniqueSlot = self.items[i].uniqueSlot;
            if (uniqueSlot == Slots.SHIRT || uniqueSlot == Slots.CHEST || uniqueSlot == Slots.TABARD) drawBra = false;
            if (self.items[i].slot == Slots.ROBE || uniqueSlot == Slots.PANTS) drawPanties = false
        }
        if (drawBra && self.bakedTextures[Region.TorsoUpper][1]) {
            if (!self.bakedTextures[Region.TorsoUpper][1].mergeImages()) return;
            r = regions[Region.TorsoUpper];
            ctx.drawImage(self.bakedTextures[Region.TorsoUpper][1].mergedImg, w * r.x, h * r.y, w * r.w, h * r.h)
        }
        if (drawPanties && self.bakedTextures[Region.LegUpper][1]) {
            if (!self.bakedTextures[Region.LegUpper][1].mergeImages()) return;
            r = regions[Region.LegUpper];
            ctx.drawImage(self.bakedTextures[Region.LegUpper][1].mergedImg, w * r.x, h * r.y, w * r.w, h * r.h)
        }
        var items = [];
        for (i in self.items) {
            items.push(self.items[i])
        }
        items.sort(function(a, b) {
            return a.sortValue - b.sortValue
        });
        for (i = 0; i < items.length; ++i) {
            item = items[i];
            if (!item.textures) continue;
            for (j = 0; j < item.textures.length; ++j) {
                t = item.textures[j];
                if (t.gender != self.gender || !t.texture || !t.texture.mergeImages()) continue;
                if (t.region > 0) {
                    if ((self.race == Races.TAUREN || self.race == Races.TROLL || self.race == Races.DRAENEI || self.race == Races.BROKEN || self.race == Races.WORGEN) && t.region == Region.Foot) continue;
                    r = regions[t.region];
                    ctx.drawImage(t.texture.mergedImg, w * r.x, h * r.y, w * r.w, h * r.h)
                }
            }
        }
        var gl = self.renderer.context;
        if (self.compositeTexture) gl.deleteTexture(self.compositeTexture);
        self.compositeTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, self.compositeTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.compositeImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        self.needsCompositing = false
    },
    loadItems: function(items) {
        var self = this;
        if ($.isArray(items)) {
            for (var i = 0; i < items.length; ++i) {
                self.addItem(items[i][0], items[i][1])
            }
        } else {
            for (var slot in items) {
                self.addItem(parseInt(slot), items[slot])
            }
        }
    },
    addItem: function(slot, id) {
        var self = this,
            Wow = ZamModelViewer.Wow;
        var item = new Wow.Item(self, slot, id, self.race, self.gender);
        var uniqueSlot = item.uniqueSlot;
        var altSlot = Wow.SlotAlternate[slot];
        if (!self.items[uniqueSlot] || altSlot == 0) {
            self.items[uniqueSlot] = item
        } else {
            item.uniqueSlot = altSlot;
            self.items[altSlot] = item
        }
    },
    removeSlot: function(slot) {
        var self = this;
        if (self.items[slot]) {
            if (self.items[slot].models) {
                for (var i = 0; i < self.items[slot].models.length; ++i) {
                    if (self.items[slot].models[i].model){
						console.log("slot : " + slot)
						console.log("item : " + self.items[slot])
						console.log("slot model : " + self.items[slot].models[i].model)
						console.log("length : " + self.items[slot].models.length)
						self.items[slot].models[i].model.destroy()
					}
                }
            }
            self.items[slot] = null;
            delete self.items[slot]
        }
    },
    onLoaded: function() {
        var self = this,
            i;
        if (self.texUnits) {
            for (i = 0; i < self.texUnits.length; ++i) self.texUnits[i].setup(self);
            self.sortedTexUnits = self.texUnits.concat();
            self.sortedTexUnits.sort(function(a, b) {
                if (a.meshId == b.meshId) return a.meshIndex - b.meshIndex;
                else return a.meshId - b.meshId
            })
        }
        if (self.attachments && self.attachmentLookup) {
            var slotMap = {
                1: [11],
                3: [6, 5],
                22: [2],
                21: [1],
                17: [1],
                15: [2],
                25: [1],
                13: [1],
                14: [0],
                23: [2],
                6: [53],
                26: [1]
            };
            var mountOverrides = {
                21: 26,
                22: 27,
                17: 26,
                15: 28,
                25: 32,
                13: 32,
                23: 33,
                14: 28,
                26: 26
            };
            for (var slot in slotMap) {
                for (i = 0; i < slotMap[slot].length; ++i) {
                    var att = slotMap[slot][i];
                    if (self.mount && mountOverrides[slot]) att = mountOverrides[slot];
                    if (att >= self.attachmentLookup.length || self.attachmentLookup[att] == -1) continue;
                    if (!self.slotAttachments[slot]) self.slotAttachments[slot] = [];
                    self.slotAttachments[slot].push(self.attachmentLookup[att])
                }
            }
        }
        if (self.modelPath == "creature/saberon/saberon.mo3") {
            self.setAnimation("StealthStand")
        } else if (self.mount) {
            if (ZamModelViewer.Wow.StandingMounts[self.mount.model.id]) {
                self.setAnimation("StealthStand")
            } else {
                self.setAnimation("Mount")
            }
        } else {
            self.setAnimation("Stand")
        }
        self.updateBuffers(true);
        self.updateBounds();
        self.setup();
        self.loaded = true;
        if (self.isMount && self.parent.loaded) {
            self.parent.updateBounds()
        }
        if (self.parent && self.parent.loaded) {
            self.parent.updateMeshes()
        }
    },
    setAnimation: function(name) {
        var self = this,
            anim, Wow = ZamModelViewer.Wow;
        //console.log("animations length : " + self.animations.length)
        self.animationList = [];
        //var count = 0
        console.log("set animation")
        var run = null
        for (var i = 0; i < self.animations.length; ++i) {
            anim = self.animations[i];
            if (!anim.name) continue;
            console.log(i + ": " + anim.name)

            if (anim.name == name && name == "Stand") {
                if (self.race == Wow.Races.PANDAREN && self.gender == Wow.Genders.MALE && anim.length == 11900) continue;
                self.animationList.push(anim)
            } else if (anim.name == name && name == "JumpLandRun"){
                console.log("JumpLandRun found")
                console.log(anim)
                anim.speed = 1e-43
                //anim.length = 500
                self.animationList.push(anim)
            }else if (anim.name == name) {
                self.animationList.push(anim)
            }/*
            if(anim.name == "JumpLandRun"){
                console.log("run found")
                console.log(anim)
            }*/
            
        }
        //self.animationList.push(run)
        if(run){
            console.log(run)
            //self.animationList.push(run)
        }
        self.animStartTime = 0;
        self.currentAnimation = self.animationList.length > 0 ? self.animationList[0] : null;
        if (name != "Stand" && !self.currentAnimation) {
            self.setAnimation("Stand")
        }
    }
};
ZamModelViewer.Wow.Model.prototype.update = function() {
    //console.log("update")
    var self = this,
        i, j;
    if (!self.loaded || !self.texUnits) return;
    self.frame++;
    self.time = self.renderer.time;
    if (self.animationList && self.animationList.length > 0) {
        //console.log("animation list > 0")
        if (self.animStartTime == 0) self.animStartTime = self.time;
        if (self.time - self.animStartTime >= self.currentAnimation.length) {
            var nextAnim = Math.max(0, Math.randomInt(0, self.animationList.length + 3) - 3);
            //var nextAnim = 1
            /*for(var i=0; i<self.animationList.length; i++){
                console.log(self.animationList[i].name)

            }
            console.log("------")
            */
            //console.log(nextAnim)
            //console.log(self.currentAnimation.name)
            //console.log(self.animationList[nextAnim].name)
            //console.log(self.animationList["Stand"].name)
            //self.setAnimation("Run")
            

            //self.currentAnimation = self.animationList[nextAnim];
            //self.setAnimation("Run")
            self.animStartTime = self.time
        }
    }
    var numUnits = self.texUnits.length,
        count, start, u;
    for (i = 0; i < numUnits; ++i) {
        u = self.texUnits[i];
        if (!u.show) continue;
        count = u.mesh.indexCount;
        start = u.mesh.indexStart;
        for (j = 0; j < count; ++j) self.vertices[self.indices[start + j]].frame = self.frame
    }
    var numBones = self.bones.length,
        animTime = self.time - self.animStartTime,
        vb = self.vbData;
    if (self.bones && self.animations) {
        for (i = 0; i < numBones; ++i) self.bones[i].updated = false;
        for (i = 0; i < numBones; ++i) self.bones[i].update(animTime);
        if (self.vertices) {
            var numVerts = self.vertices.length,
                v, b, w, idx, tmpVec3 = self.tmpVec3,
                tmpVec4 = self.tmpVec4;
            for (i = 0; i < numVerts; ++i) {
                v = self.vertices[i];
                if (v.frame != self.frame) continue;
                idx = i * 8;
                vb[idx] = vb[idx + 1] = vb[idx + 2] = vb[idx + 3] = vb[idx + 4] = vb[idx + 5] = 0;
                for (j = 0; j < 4; ++j) {
                    w = v.weights[j] / 255;
                    if (w > 0) {
                        b = self.bones[v.bones[j]];
                        vec3.transformMat4(tmpVec3, v.position, b.matrix);
                        vec4.transformMat4(tmpVec4, v.normal, b.matrix);
                        vb[idx + 0] += tmpVec3[0] * w;
                        vb[idx + 1] += tmpVec3[1] * w;
                        vb[idx + 2] += tmpVec3[2] * w;
                        vb[idx + 3] += tmpVec4[0] * w;
                        vb[idx + 4] += tmpVec4[1] * w;
                        vb[idx + 5] += tmpVec4[2] * w
                    }
                }
                v.transPosition[0] = vb[idx + 0];
                v.transPosition[1] = vb[idx + 1];
                v.transPosition[2] = vb[idx + 2];
                v.transNormal[0] = vb[idx + 3];
                v.transNormal[1] = vb[idx + 4];
                v.transNormal[2] = vb[idx + 5]
            }
            self.updateBuffers(false);
            if (!self.animBounds) {
                self.animBounds = true;
                self.updateBounds()
            }
        }
    }
};

ZamModelViewer.Wow.ReversedItems = {
    139260: true
};
ZamModelViewer.Wow.StandingMounts = {
    28060: true,
    28063: true,
    28082: true,
    41903: true,
    42147: true,
    44808: true,
    45271: true
};
ZamModelViewer.Wow.Types = {
    ITEM: 1,
    HELM: 2,
    SHOULDER: 4,
    NPC: 8,
    CHARACTER: 16,
    HUMANOIDNPC: 32,
    OBJECT: 64,
    ARMOR: 128,
    PATH: 256
};
ZamModelViewer.Wow.Classes = {
    WARRIOR: 1,
    PALADIN: 2,
    HUNTER: 3,
    ROGUE: 4,
    PRIEST: 5,
    DEATHKNIGHT: 6,
    SHAMAN: 7,
    MAGE: 8,
    WARLOCK: 9,
    MONK: 10,
    DRUID: 11
};
ZamModelViewer.Wow.Genders = {
    MALE: 0,
    FEMALE: 1,
    0: "male",
    1: "female"
};
ZamModelViewer.Wow.Races = {
    HUMAN: 1,
    ORC: 2,
    DWARF: 3,
    NIGHTELF: 4,
    SCOURGE: 5,
    TAUREN: 6,
    GNOME: 7,
    TROLL: 8,
    GOBLIN: 9,
    BLOODELF: 10,
    DRAENEI: 11,
    FELORC: 12,
    NAGA: 13,
    BROKEN: 14,
    SKELETON: 15,
    VRYKUL: 16,
    TUSKARR: 17,
    FORESTTROLL: 18,
    TAUNKA: 19,
    NORTHRENDSKELETON: 20,
    ICETROLL: 21,
    WORGEN: 22,
    WORGENHUMAN: 23,
    PANDAREN: 24,
    1: "human",
    2: "orc",
    3: "dwarf",
    4: "nightelf",
    5: "scourge",
    6: "tauren",
    7: "gnome",
    8: "troll",
    9: "goblin",
    10: "bloodelf",
    11: "draenei",
    12: "felorc",
    13: "naga_",
    14: "broken",
    15: "skeleton",
    16: "vrykul",
    17: "tuskarr",
    18: "foresttroll",
    19: "taunka",
    20: "northrendskeleton",
    21: "icetroll",
    22: "worgen",
    23: "human",
    24: "pandaren",
    25: "pandaren",
    26: "pandaren"
};
ZamModelViewer.Wow.UniqueSlots = [0, 1, 0, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 21, 22, 22, 16, 21, 0, 19, 5, 21, 22, 22, 0, 21, 21];
ZamModelViewer.Wow.SlotOrder = [0, 16, 0, 15, 1, 8, 10, 5, 6, 6, 7, 0, 0, 17, 18, 19, 14, 20, 0, 9, 8, 21, 22, 23, 0, 24, 25];
ZamModelViewer.Wow.SlotAlternate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0];
ZamModelViewer.Wow.SlotType = [0, 2, 0, 4, 128, 128, 128, 128, 128, 128, 128, 0, 0, 1, 1, 1, 128, 1, 0, 128, 128, 1, 1, 1, 0, 1, 1];
ZamModelViewer.Wow.Slots = {
    HEAD: 1,
    SHOULDER: 3,
    SHIRT: 4,
    CHEST: 5,
    BELT: 6,
    PANTS: 7,
    BOOTS: 8,
    BRACERS: 9,
    HANDS: 10,
    ONEHAND: 13,
    SHIELD: 14,
    BOW: 15,
    CAPE: 16,
    TWOHAND: 17,
    TABARD: 19,
    ROBE: 20,
    RIGHTHAND: 21,
    LEFTHAND: 22,
    OFFHAND: 23,
    THROWN: 25,
    RANGED: 26
};
ZamModelViewer.Wow.Regions = {
    Base: 0,
    ArmUpper: 1,
    ArmLower: 2,
    Hand: 3,
    FaceUpper: 4,
    FaceLower: 5,
    TorsoUpper: 6,
    TorsoLower: 7,
    LegUpper: 8,
    LegLower: 9,
    Foot: 10,
    FaceLower2: 11,
    old: [{
        x: 0,
        y: 0,
        w: 1,
        h: 1
    }, {
        x: 0,
        y: 0,
        w: .5,
        h: .25
    }, {
        x: 0,
        y: .25,
        w: .5,
        h: .25
    }, {
        x: 0,
        y: .5,
        w: .5,
        h: .125
    }, {
        x: 0,
        y: .625,
        w: .5,
        h: .125
    }, {
        x: 0,
        y: .75,
        w: .5,
        h: .25
    }, {
        x: .5,
        y: 0,
        w: .5,
        h: .25
    }, {
        x: .5,
        y: .25,
        w: .5,
        h: .125
    }, {
        x: .5,
        y: .375,
        w: .5,
        h: .25
    }, {
        x: .5,
        y: .625,
        w: .5,
        h: .25
    }, {
        x: .5,
        y: .875,
        w: .5,
        h: .125
    }],
    "new": [{
        x: 0,
        y: 0,
        w: 1,
        h: 1
    }, {
        x: 0,
        y: 0,
        w: .25,
        h: .25
    }, {
        x: 0,
        y: .25,
        w: .25,
        h: .25
    }, {
        x: 0,
        y: .5,
        w: .25,
        h: .125
    }, {
        x: .5,
        y: 0,
        w: .5,
        h: 1
    }, {
        x: 0,
        y: .75,
        w: .25,
        h: .25
    }, {
        x: .25,
        y: 0,
        w: .25,
        h: .25
    }, {
        x: .25,
        y: .25,
        w: .25,
        h: .125
    }, {
        x: .25,
        y: .375,
        w: .25,
        h: .25
    }, {
        x: .25,
        y: .625,
        w: .25,
        h: .25
    }, {
        x: .25,
        y: .875,
        w: .25,
        h: .125
    }, {
        x: .5,
        y: 0,
        w: .5,
        h: 1
    }]
};
ZamModelViewer.Wow.Model.prototype.load = function() {
    var self = this,
        Type = ZamModelViewer.Wow.Types;
    if (!self.model || !self.model.type || !self.model.id) return;
    self._load(self.model.type, self.model.id)
};
ZamModelViewer.Wow.Model.prototype._load = function(type, id) {
    var self = this,
        Type = ZamModelViewer.Wow.Types,
        url = null;
    if (type == Type.ITEM) url = "meta/item/";
    else if (type == Type.HELM) url = "meta/armor/1/";
    else if (type == Type.SHOULDER) url = "meta/armor/3/";
    else if (type == Type.NPC || type == Type.HUMANOIDNPC) url = "meta/npc/";
    else if (type == Type.OBJECT) url = "meta/object/";
    else if (type == Type.CHARACTER) url = "meta/character/";
    if (url) {
        url = self.opts.contentPath + url + id + ".json";
        (function(type) {
            $.getJSON(url, function(data) {
                self.loadMeta(data, type)
            })
        })(type)
    } else if (type == Type.PATH) {
        self.modelPath = id;
        url = self.opts.contentPath + "mo3/" + id;
        $.ajax({
            url: url,
            type: "GET",
            dataType: "binary",
            responseType: "arraybuffer",
            processData: false,
            renderer: self.renderer,
            success: function(buffer) {
                self.loadMo3(buffer)
            },
            error: function(xhr, status, error) {
                console.log(error)
            }
        })
    }
};
ZamModelViewer.Wow.Model.prototype.loadMeta = function(meta, type) {
    var self = this,
        Type = ZamModelViewer.Wow.Types,
        model, i;
    if (!type) type = self.model.type;
    if (!self.meta) self.meta = meta;
    if (type == Type.CHARACTER) {
        model = meta.Model;
        if (self.opts.hd && meta.HDModel) {
            model = meta.HDModel;
            self.isHD = true
        }
        if (self.isHD && self.meta.HDTexture) {
            self.npcTexture = new self.Texture(self, -1, self.meta.HDTexture)
        } else if (self.meta.Texture) {
            self.npcTexture = new self.Texture(self, -1, self.meta.Texture)
        }
        self.race = meta.Race;
        self.gender = meta.Gender;
        self._load(Type.PATH, model);
        if (self.meta.Equipment) {
            self.loadItems(self.meta.Equipment)
        }
        if (self.opts.items) {
            self.loadItems(self.opts.items)
        }
        if (self.model.type != Type.CHARACTER && self.meta.Race > 0) {
            self.skinIndex = parseInt(self.meta.SkinColor);
            self.hairIndex = parseInt(self.meta.HairStyle);
            self.hairColorIndex = parseInt(self.meta.HairColor);
            self.faceIndex = parseInt(self.meta.FaceType);
            self.faceFeatureIndex = parseInt(self.meta.FacialHair);
            self.faceColorIndex = self.hairColorIndex
        } else {
            if (self.opts.sk) self.skinIndex = parseInt(self.opts.sk);
            if (self.opts.ha) self.hairIndex = parseInt(self.opts.ha);
            if (self.opts.hc) self.hairColorIndex = parseInt(self.opts.hc);
            if (self.opts.fa) self.faceIndex = parseInt(self.opts.fa);
            if (self.opts.fh) self.faceFeatureIndex = parseInt(self.opts.fh);
            if (self.opts.fc) self.faceColorIndex = parseInt(self.opts.fc)
        }
        if (self.opts.cls) self.class = parseInt(self.opts.cls)
    } else if (type == Type.HELM) {
        var race = 1;
        var gender = 0;
        if (self.parent) {
            race = self.parent.race;
            gender = self.parent.gender;
            self.parent.hairVis = meta.ShowHair == 0;
            self.parent.faceVis = meta.ShowFacial1 == 0
        }
        if (meta.RaceModels[gender] && meta.RaceModels[gender][race]) {
            self._load(Type.PATH, meta.RaceModels[gender][race])
        }
        if (meta.Textures) {
            for (i in meta.Textures) {
                self.textureOverrides[i] = new self.Texture(self, parseInt(i), meta.Textures[i])
            }
        }
    } else if (type == Type.SHOULDER) {
        if (self.model.shoulder == 1 || self.model.shoulder === undefined && meta.Model) {
            if (meta.Model) self._load(Type.PATH, meta.Model);
            if (meta.Textures) {
                for (i in meta.Textures) {
                    self.textureOverrides[i] = new self.Texture(self, parseInt(i), meta.Textures[i])
                }
            }
        } else if (self.model.shoulder == 2 || self.model.shoulder === undefined && meta.Model2) {
            if (meta.Model2) self._load(Type.PATH, meta.Model2);
            if (meta.Textures2) {
                for (i in meta.Textures2) {
                    self.textureOverrides[i] = new self.Texture(self, parseInt(i), meta.Textures2[i])
                }
            }
        }
    } else {
        if (meta.Textures) {
            for (i in meta.Textures) {
                self.textureOverrides[i] = new self.Texture(self, parseInt(i), meta.Textures[i])
            }
        } else if (meta.GenderTextures && self.parent) {
            var g = self.parent.gender;
            for (i in meta.GenderTextures[g]) {
                self.textureOverrides[i] = new self.Texture(self, parseInt(i), meta.GenderTextures[g][i])
            }
        }
        if (self.opts.hd && meta.HDModel) {
            self._load(Type.PATH, meta.HDModel)
        } else if (meta.Model) {
            self._load(Type.PATH, meta.Model)
        } else if (meta.GenderModels && self.parent && meta.GenderModels[self.parent.gender]) {
            self._load(Type.PATH, meta.GenderModels[self.parent.gender])
        } else if (meta.Race > 0) {
            model = ZamModelViewer.Wow.Races[meta.Race] + ZamModelViewer.Wow.Genders[meta.Gender];
            self.race = meta.Race;
            self.gender = meta.Gender;
            self._load(Type.CHARACTER, model)
        }
    }
};
ZamModelViewer.Wow.Model.prototype.loadMo3 = function(buffer) {
    if (!buffer) {
        console.error("Bad buffer for DataView");
        return
    }
    var self = this,
        r = new ZamModelViewer.DataView(buffer),
        i, Wow = ZamModelViewer.Wow;
    var magic = r.getUint32();
    if (magic != 604210112) {
        console.log("Bad magic value");
        return
    }
    var version = r.getUint32();
    if (version < 2e3) {
        console.log("Bad version");
        return
    }
    var ofsVertices = r.getUint32();
    var ofsIndices = r.getUint32();
    var ofsSequences = r.getUint32();
    var ofsAnimations = r.getUint32();
    var ofsAnimLookup = r.getUint32();
    var ofsBones = r.getUint32();
    var ofsBoneLookup = r.getUint32();
    var ofsKeyBoneLookup = r.getUint32();
    var ofsMeshes = r.getUint32();
    var ofsTexUnits = r.getUint32();
    var ofsTexUnitLookup = r.getUint32();
    var ofsRenderFlags = r.getUint32();
    var ofsMaterials = r.getUint32();
    var ofsMaterialLookup = r.getUint32();
    var ofsTextureAnims = r.getUint32();
    var ofsTexAnimLookup = r.getUint32();
    var ofsTexReplacements = r.getUint32();
    var ofsAttachments = r.getUint32();
    var ofsAttachmentLookup = r.getUint32();
    var ofsColors = r.getUint32();
    var ofsAlphas = r.getUint32();
    var ofsAlphaLookup = r.getUint32();
    var ofsParticleEmitters = r.getUint32();
    var ofsRibbonEmitters = r.getUint32();
    var ofsSkinColors = r.getUint32();
    var ofsFaceTypes = r.getUint32();
    var ofsFacialStyles = r.getUint32();
    var ofsFacialColors = r.getUint32();
    var ofsHairStyles = r.getUint32();
    var ofsHairColors = r.getUint32();
    var uncompressedSize = r.getUint32();
    var compressedData = new Uint8Array(buffer, r.position);
    var data = null;
    try {
        data = pako.inflate(compressedData)
    } catch (err) {
        console.log("Decompression error: " + err);
        return
    }
    if (data.length < uncompressedSize) {
        console.log("Unexpected data size", data.length, uncompressedSize);
        return
    }
    r = new ZamModelViewer.DataView(data.buffer);
    r.position = ofsVertices;
    var numVertices = r.getInt32();
    if (numVertices > 0) {
        self.vertices = new Array(numVertices);
        for (i = 0; i < numVertices; ++i) {
            self.vertices[i] = new Wow.Vertex(r)
        }
    }
    r.position = ofsIndices;
    var numIndices = r.getInt32();
    if (numIndices > 0) {
        self.indices = new Array(numIndices);
        for (i = 0; i < numIndices; ++i) {
            self.indices[i] = r.getUint16()
        }
    }
    r.position = ofsAnimations;
    var numAnims = r.getInt32();
    if (numAnims > 0) {
        self.animations = new Array(numAnims);
        for (i = 0; i < numAnims; ++i) {
            self.animations[i] = new Wow.Animation(r)
        }
    }
    r.position = ofsAnimLookup;
    var numAnimLookup = r.getInt32();
    if (numAnimLookup > 0) {
        self.animLookup = new Array(numAnimLookup);
        for (i = 0; i < numAnimLookup; ++i) {
            self.animLookup[i] = r.getInt16()
        }
    }
    r.position = ofsBones;
    var numBones = r.getInt32();
    if (numBones > 0) {
        self.bones = new Array(numBones);
        for (i = 0; i < numBones; ++i) {
            self.bones[i] = new Wow.Bone(self, i, r)
        }
    }
    r.position = ofsBoneLookup;
    var numBoneLookup = r.getInt32();
    if (numBoneLookup > 0) {
        self.boneLookup = new Array(numBoneLookup);
        for (i = 0; i < numBoneLookup; ++i) {
            self.boneLookup[i] = r.getInt16()
        }
    }
    r.position = ofsKeyBoneLookup;
    var numKeyBoneLookup = r.getInt32();
    if (numKeyBoneLookup > 0) {
        self.keyBoneLookup = new Array(numKeyBoneLookup);
        for (i = 0; i < numKeyBoneLookup; ++i) {
            self.keyBoneLookup[i] = r.getInt16()
        }
    }
    r.position = ofsMeshes;
    var numMeshes = r.getInt32();
    if (numMeshes > 0) {
        self.meshes = new Array(numMeshes);
        for (i = 0; i < numMeshes; ++i) {
            self.meshes[i] = new Wow.Mesh(r)
        }
    }
    r.position = ofsTexUnits;
    var numTexUnits = r.getInt32();
    if (numTexUnits > 0) {
        self.texUnits = new Array(numTexUnits);
        for (i = 0; i < numTexUnits; ++i) {
            self.texUnits[i] = new Wow.TexUnit(r)
        }
    }
    r.position = ofsTexUnitLookup;
    var numTexUnitLookup = r.getInt32();
    if (numTexUnitLookup > 0) {
        self.texUnitLookup = new Array(numTexUnitLookup);
        for (i = 0; i < numTexUnitLookup; ++i) {
            self.texUnitLookup[i] = r.getInt16()
        }
    }
    r.position = ofsRenderFlags;
    var numRenderFlags = r.getInt32();
    if (numRenderFlags > 0) {
        self.renderFlags = new Array(numRenderFlags);
        for (i = 0; i < numRenderFlags; ++i) {
            self.renderFlags[i] = new Wow.RenderFlag(r)
        }
    }
    r.position = ofsMaterials;
    var numMaterials = r.getInt32();
    if (numMaterials > 0) {
        self.materials = new Array(numMaterials);
        for (i = 0; i < numMaterials; ++i) {
            self.materials[i] = new Wow.Material(self, i, r)
        }
    }
    r.position = ofsMaterialLookup;
    var numMaterialLookup = r.getInt32();
    if (numMaterialLookup > 0) {
        self.materialLookup = new Array(numMaterialLookup);
        for (i = 0; i < numMaterialLookup; ++i) {
            self.materialLookup[i] = r.getInt16()
        }
    }
    r.position = ofsTextureAnims;
    var numTextureAnims = r.getInt32();
    if (numTextureAnims > 0) {
        self.textureAnims = new Array(numTextureAnims);
        for (i = 0; i < numTextureAnims; ++i) {
            self.textureAnims[i] = new Wow.TextureAnimation(r)
        }
    }
    r.position = ofsTexAnimLookup;
    var numTexAnimLookup = r.getInt32();
    if (numTexAnimLookup > 0) {
        self.textureAnimLookup = new Array(numTexAnimLookup);
        for (i = 0; i < numTexAnimLookup; ++i) {
            self.textureAnimLookup[i] = r.getInt16()
        }
    }
    r.position = ofsTexReplacements;
    var numTexReplacements = r.getInt32();
    if (numTexReplacements > 0) {
        self.textureReplacements = new Array(numTexReplacements);
        for (i = 0; i < numTexReplacements; ++i) {
            self.textureReplacements[i] = r.getInt16()
        }
    }
    r.position = ofsAttachments;
    var numAttachments = r.getInt32();
    if (numAttachments > 0) {
        self.attachments = new Array(numAttachments);
        for (i = 0; i < numAttachments; ++i) {
            self.attachments[i] = new Wow.Attachment(r)
        }
    }
    r.position = ofsAttachmentLookup;
    var numAttachmentLookup = r.getInt32();
    if (numAttachmentLookup > 0) {
        self.attachmentLookup = new Array(numAttachmentLookup);
        for (i = 0; i < numAttachmentLookup; ++i) {
            self.attachmentLookup[i] = r.getInt16()
        }
    }
    r.position = ofsColors;
    var numColors = r.getInt32();
    if (numColors > 0) {
        self.colors = new Array(numColors);
        for (i = 0; i < numColors; ++i) {
            self.colors[i] = new Wow.Color(r)
        }
    }
    r.position = ofsAlphas;
    var numAlphas = r.getInt32();
    if (numAlphas > 0) {
        self.alphas = new Array(numAlphas);
        for (i = 0; i < numAlphas; ++i) {
            self.alphas[i] = new Wow.Alpha(r)
        }
    }
    r.position = ofsAlphaLookup;
    var numAlphaLookup = r.getInt32();
    if (numAlphaLookup > 0) {
        self.alphaLookup = new Array(numAlphaLookup);
        for (i = 0; i < numAlphaLookup; ++i) {
            self.alphaLookup[i] = r.getInt16()
        }
    }
    r.position = ofsParticleEmitters;
    var numParticleEmitters = r.getInt32();
    if (numParticleEmitters > 0) {
        self.particleEmitters = new Array(numParticleEmitters);
        for (i = 0; i < numParticleEmitters; ++i) {
            self.particleEmitters[i] = new Wow.ParticleEmitter(self, r)
        }
    }
    r.position = ofsRibbonEmitters;
    var numRibbonEmitters = r.getInt32();
    if (numRibbonEmitters > 0) {
        self.ribbonEmitters = new Array(numRibbonEmitters);
        for (i = 0; i < numRibbonEmitters; ++i) {
            self.ribbonEmitters[i] = new Wow.RibbonEmitter(self, r)
        }
    }
    r.position = ofsSkinColors;
    var numSkinColors = r.getInt32();
    if (numSkinColors > 0) {
        self.skins = new Array(numSkinColors);
        for (i = 0; i < numSkinColors; ++i) {
            self.skins[i] = new Wow.Skin(r, version)
        }
        r.position = ofsFaceTypes;
        for (i = 0; i < numSkinColors; ++i) {
            self.skins[i].readFaces(r, version)
        }
    }
    r.position = ofsFacialStyles;
    var numFaceStyles = r.getInt32();
    if (numFaceStyles > 0) {
        self.faces = new Array(numFaceStyles);
        for (i = 0; i < numFaceStyles; ++i) {
            self.faces[i] = new Wow.Face(r)
        }
        data.position = ofsFacialColors;
        for (i = 0; i < numFaceStyles; ++i) {
            self.faces[i].readTextures(r, version)
        }
    }
    r.position = ofsHairStyles;
    var numHairStyles = r.getInt32();
    if (numHairStyles > 0) {
        self.hairs = new Array(numHairStyles);
        for (i = 0; i < numHairStyles; ++i) {
            self.hairs[i] = new Wow.Hair(r)
        }
        data.position = ofsHairColors;
        for (i = 0; i < numHairStyles; ++i) {
            self.hairs[i].readTextures(r, version)
        }
    }
    self.onLoaded()
};
ZamModelViewer.Wow.Model.prototype.draw = function(flipWinding) {
    var self = this,
        gl = self.renderer.context,
        i, Wow = ZamModelViewer.Wow;
    if (self.mount) {
        self.mount.draw();
        if (self.mount.loaded) {
            var attach = self.mount.attachments[self.mount.attachmentLookup[0]];
            var scale = 1 / self.mount.meta.Scale;
            vec3.set(self.tmpVec, scale, scale, scale);
            mat4.identity(self.tmpMat);
            mat4.scale(self.tmpMat, self.tmpMat, self.tmpVec);
            self.setMatrix(self.mount.matrix, self.mount.bones[attach.bone].matrix, attach.position, self.tmpMat)
        }
    }
    if (!self.loaded || !self.texUnits) return;
    self.update();
    if (!self.shaderReady) self.initShader();
    if (!self.program) return;
    if (self.needsCompositing) self.compositeTextures();
    gl.useProgram(self.program);
    gl.uniformMatrix4fv(self.uniforms.vModelMatrix, false, self.matrix);
    gl.uniformMatrix4fv(self.uniforms.vViewMatrix, false, self.renderer.viewMatrix);
    gl.uniformMatrix4fv(self.uniforms.vProjMatrix, false, self.renderer.projMatrix);
    gl.uniform3fv(self.uniforms.vCameraPos, self.renderer.eye);
    gl.uniform4fv(self.uniforms.fAmbientColor, self.ambientColor);
    gl.uniform4fv(self.uniforms.fPrimaryColor, self.primaryColor);
    gl.uniform4fv(self.uniforms.fSecondaryColor, self.secondaryColor);
    gl.uniform3fv(self.uniforms.fLightDir1, self.lightDir1);
    gl.uniform3fv(self.uniforms.fLightDir2, self.lightDir2);
    gl.uniform3fv(self.uniforms.fLightDir3, self.lightDir3);
    gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.ib);
    for (i in self.attribs) {
        var a = self.attribs[i];
        gl.enableVertexAttribArray(a.loc);
        gl.vertexAttribPointer(a.loc, a.size, a.type, false, a.stride, a.offset)
    }
    if (flipWinding) gl.frontFace(gl.CW);
    for (i = 0; i < self.sortedTexUnits.length; ++i) {
        if (!self.sortedTexUnits[i].show) continue;
        self.sortedTexUnits[i].draw()
    }
    if (flipWinding) gl.frontFace(gl.CCW);
    for (i in self.items) {
        var item = self.items[i];
        if (!item.models) continue;
        for (var j = 0; j < item.models.length; ++j) {
            if (item.models[j].model && item.models[j].bone > -1 && item.models[j].bone < self.bones.length) {
                var winding = false,
                    reversed = item.models[j].model.model.type == Wow.Types.ITEM && Wow.ReversedItems[item.models[j].model.model.id];
                if (reversed && item.slot != Wow.Slots.LEFTHAND || !reversed && item.slot == Wow.Slots.LEFTHAND) {
                    mat4.identity(self.tmpMat);
                    vec3.set(self.tmpVec, 1, -1, 1);
                    mat4.scale(self.tmpMat, self.tmpMat, self.tmpVec);
                    winding = true
                } else {
                    mat4.identity(self.tmpMat)
                }
                item.models[j].model.setMatrix(self.matrix, self.bones[item.models[j].bone].matrix, item.models[j].attachment.position, self.tmpMat);
                item.models[j].model.update();
                item.models[j].model.draw(winding)
            }
        }
    }
    if (self.particleEmitters) {
        for (i = 0; i < self.particleEmitters.length; ++i) {
            self.particleEmitters[i].update(self.currentAnimation.index, self.time, self.renderer.delta);
            self.particleEmitters[i].draw()
        }
    }
    if (self.ribbonEmitters) {
        for (i = 0; i < self.ribbonEmitters.length; ++i) {
            self.ribbonEmitters[i].update(self.currentAnimation.index, self.time);
            self.ribbonEmitters[i].draw()
        }
    }
    for (i in self.attribs) {
        gl.disableVertexAttribArray(self.attribs[i].loc)
    }
};
ZamModelViewer.Wow.Model.prototype.initShader = function() {
    var self = this,
        gl = self.renderer.context;
    self.shaderReady = true;
    var vs = self.renderer.compileShader(gl.VERTEX_SHADER, self.vertShader);
    var fs = self.renderer.compileShader(gl.FRAGMENT_SHADER, self.fragShader);
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking shaders");
        return
    }
    self.vs = vs;
    self.fs = fs;
    self.program = program;
    self.uniforms = {
        vModelMatrix: gl.getUniformLocation(program, "uModelMatrix"),
        vViewMatrix: gl.getUniformLocation(program, "uViewMatrix"),
        vProjMatrix: gl.getUniformLocation(program, "uProjMatrix"),
        vCameraPos: gl.getUniformLocation(program, "uCameraPos"),
        vTextureMatrix: gl.getUniformLocation(program, "uTextureMatrix"),
        fHasTexture: gl.getUniformLocation(program, "uHasTexture"),
        fHasAlpha: gl.getUniformLocation(program, "uHasAlpha"),
        fBlendMode: gl.getUniformLocation(program, "uBlendMode"),
        fUnlit: gl.getUniformLocation(program, "uUnlit"),
        fColor: gl.getUniformLocation(program, "uColor"),
        fAmbientColor: gl.getUniformLocation(program, "uAmbientColor"),
        fPrimaryColor: gl.getUniformLocation(program, "uPrimaryColor"),
        fSecondaryColor: gl.getUniformLocation(program, "uSecondaryColor"),
        fLightDir1: gl.getUniformLocation(program, "uLightDir1"),
        fLightDir2: gl.getUniformLocation(program, "uLightDir2"),
        fLightDir3: gl.getUniformLocation(program, "uLightDir3"),
        fTexture: gl.getUniformLocation(program, "uTexture"),
        fAlpha: gl.getUniformLocation(program, "uAlpha")
    };
    self.attribs = {
        position: {
            loc: gl.getAttribLocation(program, "aPosition"),
            type: gl.FLOAT,
            size: 3,
            offset: 0,
            stride: 32
        },
        normal: {
            loc: gl.getAttribLocation(program, "aNormal"),
            type: gl.FLOAT,
            size: 3,
            offset: 12,
            stride: 32
        },
        texcoord: {
            loc: gl.getAttribLocation(program, "aTexCoord"),
            type: gl.FLOAT,
            size: 2,
            offset: 24,
            stride: 32
        }
    }
};
ZamModelViewer.Wow.Model.prototype.vertShader = "    attribute vec3 aPosition;    attribute vec3 aNormal;    attribute vec2 aTexCoord;        varying vec3 vNormal;    varying vec2 vTexCoord;        uniform mat4 uModelMatrix;    uniform mat4 uPanningMatrix;    uniform mat4 uViewMatrix;    uniform mat4 uProjMatrix;    uniform mat4 uTextureMatrix;    uniform vec3 uCameraPos;        void main(void) {        gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1);                vTexCoord = (uTextureMatrix * vec4(aTexCoord, 0, 1)).st;        vNormal = mat3(uViewMatrix * uModelMatrix) * aNormal;    }";
ZamModelViewer.Wow.Model.prototype.fragShader = "    precision mediump float;        varying vec3 vNormal;    varying vec2 vTexCoord;        uniform bool uHasTexture;    uniform bool uHasAlpha;    uniform int uBlendMode;    uniform bool uUnlit;    uniform vec4 uColor;    uniform vec4 uAmbientColor;    uniform vec4 uPrimaryColor;    uniform vec4 uSecondaryColor;    uniform vec3 uLightDir1;    uniform vec3 uLightDir2;    uniform vec3 uLightDir3;    uniform sampler2D uTexture;    uniform sampler2D uAlpha;        void main(void) {        vec4 color = vec4(1, 1, 1, 1);        if (uHasTexture) {            color = texture2D(uTexture, vTexCoord.st);        } else {            color = vec4(vTexCoord.st, 0, 1);        }                if ((uBlendMode == 1 || uBlendMode == 2 || uBlendMode == 4) && uHasAlpha) {            color.a = texture2D(uAlpha, vTexCoord.st).r;        }                color *= uColor;                if (uBlendMode == 1) {            if (color.a < 0.7) {                discard;            }        }                if (!uUnlit) {            vec4 litColor = uAmbientColor;            vec3 normal = normalize(vNormal);                        float dp = max(0.0, dot(normal, uLightDir1));            litColor += uPrimaryColor * dp;                        dp = max(0.0, dot(normal, uLightDir2));            litColor += uSecondaryColor * dp;                        dp = max(0.0, dot(normal, uLightDir3));            litColor += uSecondaryColor * dp;                        litColor = clamp(litColor, vec4(0,0,0,0), vec4(1,1,1,1));            color *= litColor;        }                gl_FragColor = color;    }";
ZamModelViewer.Wow.Model.prototype.destroy = function() {
    var self = this;
    if (!self.renderer) return;
    var gl = self.renderer.context,
        i, j;
    if (self.program) gl.deleteProgram(self.program);
    if (self.vs) gl.deleteShader(self.vs);
    if (self.fs) gl.deleteShader(self.fs);
    if (self.vb) gl.deleteBuffer(self.vb);
    if (self.ib) gl.deleteBuffer(self.ib);
    self.program = null;
    self.vs = null;
    self.fs = null;
    self.vb = null;
    self.ib = null;
    self.vbData = null;
    self.uniforms = null;
    self.attribs = null;
    if (self.compositeTexture) gl.deleteTexture(self.compositeTexture);
    if (self.npcTexture) self.npcTexture.destroy();
    if (self.bakedTextures) {
        for (i = 0; i < 11; ++i) {
            for (j in self.bakedTextures[i]) {
                self.bakedTextures[i][j].destroy()
            }
        }
    }
    if (self.specialTextures) {
        for (i in self.specialTextures) {
            self.specialTextures[i].destroy()
        }
    }
    if (self.textureOverrides) {
        for (i in self.textureOverrides) {
            self.textureOverrides[i].destroy()
        }
    }
    if (self.indices) self.indices = null;
    if (self.animLookup) self.animLookup = null;
    if (self.boneLookup) self.boneLookup = null;
    if (self.keyBoneLookup) self.keyBoneLookup = null;
    if (self.texUnitLookup) self.texUnitLookup = null;
    if (self.materialLookup) self.materialLookup = null;
    if (self.textureAnimLookup) self.textureAnimLookup = null;
    if (self.textureReplacements) self.textureReplacements = null;
    if (self.attachmentLookup) self.attachmentLookup = null;
    if (self.alphaLookup) self.alphaLookup = null;
    if (self.renderFlags)
        for (i = 0; i < self.renderFlags.length; ++i) self.renderFlags[i] = null;
    self.renderFlags = null;
    var destroyArray = function(key) {
        if (self[key]) {
            var arr = self[key];
            for (var i = 0; i < arr.length; ++i) {
                arr[i].destroy();
                arr[i] = null
            }
            self[key] = null
        }
    };
    destroyArray("vertices");
    destroyArray("animations");
    destroyArray("bones");
    destroyArray("meshes");
    destroyArray("texUnits");
    destroyArray("materials");
    destroyArray("textureAnims");
    destroyArray("attachments");
    destroyArray("colors");
    destroyArray("alphas");
    destroyArray("particleEmitters");
    destroyArray("ribbonEmitters");
    destroyArray("skins");
    destroyArray("faces");
    destroyArray("hairs");
    if (self.items) {
        for (i in self.items) {
            self.items[i].destroy();
            self.items[i] = null
        }
    }
    if (self.mount) self.mount.destroy();
    self.mount = null;
    self.renderer = null;
    self.viewer = null;
    self.model = null;
    self.items = null;
    self.textureOverrides = null;
    self.specialTextures = null;
    self.bakedTextures = null;
    self.geosets = null;
    self.slotAttachments = null;
    self.matrix = null;
    self.ambientColor = null;
    self.primaryColor = null;
    self.secondaryColor = null;
    self.lightDir1 = null;
    self.lightDir2 = null;
    self.lightDir3 = null;
    self.boundsMin = null;
    self.boundsMax = null;
    self.boundsCenter = null;
    self.boundsSize = null;
    self.tmpMat = null;
    self.tmpVec = null;
    self.tmpVec2 = null;
    self.tmpVec3 = null;
    self.tmpVec4 = null;
    self.mountMat = null
};
(function() {
    ZamModelViewer.Wow.Animated = function() {};
    ZamModelViewer.Wow.Animated.prototype = {
        destroy: function() {
            var self = this;
            for (var i = 0; i < self.data.length; ++i) self.data[i] = null;
            self.times = null;
            self.data = null;
            return null
        },
        createValue: function() {
            return this.defaultValue
        },
        defaultValue: 0,
        setDefault: function(v) {
            this.defaultValue = v
        },
        interpolate: function(v1, v2, r, result) {
            result = v1 + (v2 - v1) * r;
            return result
        },
        set: function(result, value) {
            result = value;
            return result
        },
        getDefault: function(r) {
            r = this.defaultValue;
            return r
        },
        readValue: function(r) {
            return r.getInt32()
        },
        getValue: function(time, result) {
            var self = this;
            if (result === undefined) result = self.createValue();
            else result = self.getDefault(result);
            if (self.type != 0 || self.data.length > 1) {
                if (self.times.length > 1) {
                    var maxTime = self.times[self.times.length - 1];
                    if (maxTime > 0 && time > maxTime) time %= maxTime;
                    var idx = 0,
                        numTimes = self.times.length;
                    for (var i = 0; i < numTimes; ++i) {
                        if (time >= self.times[i] && time < self.times[i + 1]) {
                            idx = i;
                            break
                        }
                    }
                    var t1 = self.times[idx],
                        t2 = self.times[idx + 1],
                        r = 0;
                    if (t1 != t2) r = (time - t1) / (t2 - t1);
                    if (self.type == 1) return self.interpolate(self.data[idx], self.data[idx + 1], r, result);
                    else {
                        result = self.set(result, self.data[idx]);
                        return result
                    }
                } else if (self.data.length > 0) {
                    result = self.set(result, self.data[0]);
                    return result
                } else {
                    return result
                }
            } else {
                if (self.data.length == 0) return result;
                else {
                    result = self.set(result, self.data[0]);
                    return result
                }
            }
        },
        read: function(r) {
            var self = this,
                i;
            self.type = r.getInt16();
            self.seq = r.getInt16();
            self.used = r.getBool();
            var numTimes = r.getInt32();
            self.times = new Array(numTimes);
            for (i = 0; i < numTimes; ++i) {
                self.times[i] = r.getInt32()
            }
            var numData = r.getInt32();
            self.data = new Array(numData);
            for (i = 0; i < numData; ++i) {
                self.data[i] = self.readValue(r)
            }
        }
    };
    ZamModelViewer.Wow.Animated.destroySet = function(dataset) {
        if (!dataset || dataset.length == 0) return;
        for (var i = 0; i < dataset.length; ++i) {
            dataset[i].destroy();
            dataset[i] = null
        }
        return null
    };
    ZamModelViewer.Wow.Animated.getValue = function(type, dataset, anim, time, result) {
        if (!result) result = type.createValue();
        else result = type.getDefault(result);
        if (!dataset || dataset.length == 0) return result;
        if (anim >= dataset.length) anim = 0;
        return dataset[anim].getValue(time, result)
    };
    ZamModelViewer.Wow.Animated.isUsed = function(dataset, anim) {
        if (!dataset || dataset.length == 0) return false;
        if (anim >= dataset.length) anim = 0;
        return dataset[anim].used
    };
    ZamModelViewer.Wow.AnimatedVec3 = function(r) {
        var self = this;
        self.read(r)
    };
    ZamModelViewer.Wow.AnimatedVec3.prototype = new ZamModelViewer.Wow.Animated;
    ZamModelViewer.Wow.AnimatedVec3.prototype.constructor = ZamModelViewer.Wow.AnimatedVec3;
    ZamModelViewer.Wow.AnimatedVec3.prototype.createValue = function() {
        return vec3.clone(this.defaultValue)
    };
    ZamModelViewer.Wow.AnimatedVec3.prototype.defaultValue = vec3.create();
    ZamModelViewer.Wow.AnimatedVec3.prototype.getDefault = function(result) {
        vec3.copy(result, this.defaultValue);
        return result
    };
    ZamModelViewer.Wow.AnimatedVec3.prototype.interpolate = function(v1, v2, r, result) {
        return vec3.lerp(result, v1, v2, r)
    };
    ZamModelViewer.Wow.AnimatedVec3.prototype.set = function(result, value) {
        result[0] = value[0];
        result[1] = value[1];
        result[2] = value[2]
    };
    ZamModelViewer.Wow.AnimatedVec3.prototype.readValue = function(r) {
        return vec3.set(vec3.create(), r.getFloat(), r.getFloat(), r.getFloat())
    };
    ZamModelViewer.Wow.AnimatedVec3.getValue = function(dataset, anim, time, result) {
        return ZamModelViewer.Wow.Animated.getValue(ZamModelViewer.Wow.AnimatedVec3.prototype, dataset, anim, time, result)
    };
    ZamModelViewer.Wow.AnimatedVec3.readSet = function(r) {
        var count = r.getInt32();
        var data = new Array(count);
        for (var i = 0; i < count; ++i) data[i] = new ZamModelViewer.Wow.AnimatedVec3(r);
        return data
    };
    ZamModelViewer.Wow.AnimatedQuat = function(r) {
        var self = this;
        self.read(r)
    };
    ZamModelViewer.Wow.AnimatedQuat.prototype = new ZamModelViewer.Wow.Animated;
    ZamModelViewer.Wow.AnimatedQuat.prototype.constructor = ZamModelViewer.Wow.AnimatedQuat;
    ZamModelViewer.Wow.AnimatedQuat.prototype.createValue = function() {
        return quat.clone(this.defaultValue)
    };
    ZamModelViewer.Wow.AnimatedQuat.prototype.defaultValue = quat.create();
    ZamModelViewer.Wow.AnimatedQuat.prototype.getDefault = function(result) {
        quat.copy(result, this.defaultValue);
        return result
    };
    ZamModelViewer.Wow.AnimatedQuat.prototype.interpolate = function(v1, v2, r, result) {
        return quat.slerp(result, v1, v2, r)
    };
    ZamModelViewer.Wow.AnimatedQuat.prototype.set = function(result, value) {
        result[0] = value[0];
        result[1] = value[1];
        result[2] = value[2];
        result[3] = value[3]
    };
    ZamModelViewer.Wow.AnimatedQuat.prototype.readValue = function(r) {
        return quat.set(quat.create(), r.getFloat(), r.getFloat(), r.getFloat(), r.getFloat())
    };
    ZamModelViewer.Wow.AnimatedQuat.getValue = function(dataset, anim, time, result) {
        return ZamModelViewer.Wow.Animated.getValue(ZamModelViewer.Wow.AnimatedQuat.prototype, dataset, anim, time, result)
    };
    ZamModelViewer.Wow.AnimatedUint16 = function(r) {
        var self = this;
        self.read(r)
    };
    ZamModelViewer.Wow.AnimatedUint16.prototype = new ZamModelViewer.Wow.Animated;
    ZamModelViewer.Wow.AnimatedUint16.prototype.constructor = ZamModelViewer.Wow.AnimatedUint16;
    ZamModelViewer.Wow.AnimatedUint16.prototype.readValue = function(r) {
        return r.getUint16()
    };
    ZamModelViewer.Wow.AnimatedUint16.getValue = function(dataset, anim, time, result) {
        return ZamModelViewer.Wow.Animated.getValue(ZamModelViewer.Wow.AnimatedUint16.prototype, dataset, anim, time, result)
    };
    ZamModelViewer.Wow.AnimatedUint16.readSet = function(r) {
        var count = r.getInt32();
        var data = new Array(count);
        for (var i = 0; i < count; ++i) data[i] = new ZamModelViewer.Wow.AnimatedUint16(r);
        return data
    };
    ZamModelViewer.Wow.AnimatedFloat = function(r) {
        var self = this;
        self.read(r)
    };
    ZamModelViewer.Wow.AnimatedFloat.prototype = new ZamModelViewer.Wow.Animated;
    ZamModelViewer.Wow.AnimatedFloat.prototype.constructor = ZamModelViewer.Wow.AnimatedFloat;
    ZamModelViewer.Wow.AnimatedFloat.prototype.readValue = function(r) {
        return r.getFloat()
    };
    ZamModelViewer.Wow.AnimatedFloat.getValue = function(dataset, anim, time, result) {
        return ZamModelViewer.Wow.Animated.getValue(ZamModelViewer.Wow.AnimatedFloat.prototype, dataset, anim, time, result)
    };
    ZamModelViewer.Wow.AnimatedFloat.readSet = function(r) {
        var count = r.getInt32();
        var data = new Array(count);
        for (var i = 0; i < count; ++i) data[i] = new ZamModelViewer.Wow.AnimatedFloat(r);
        return data
    };
    ZamModelViewer.Wow.AnimatedUint8 = function(r) {
        var self = this;
        self.read(r)
    };
    ZamModelViewer.Wow.AnimatedUint8.prototype = new ZamModelViewer.Wow.Animated;
    ZamModelViewer.Wow.AnimatedUint8.prototype.constructor = ZamModelViewer.Wow.AnimatedUint8;
    ZamModelViewer.Wow.AnimatedUint8.prototype.readValue = function(r) {
        return r.getUint8()
    };
    ZamModelViewer.Wow.AnimatedUint8.getValue = function(dataset, anim, time, result) {
        return ZamModelViewer.Wow.Animated.getValue(ZamModelViewer.Wow.AnimatedUint8.prototype, dataset, anim, time, result)
    };
    ZamModelViewer.Wow.AnimatedUint8.readSet = function(r) {
        var count = r.getInt32();
        var data = new Array(count);
        for (var i = 0; i < count; ++i) data[i] = new ZamModelViewer.Wow.AnimatedUint8(r);
        return data
    };
    ZamModelViewer.Wow.SAnimated = function() {};
    ZamModelViewer.Wow.SAnimated.prototype = {
        destroy: function() {
            var self = this;
            for (var i = 0; i < self.data.length; ++i) self.data[i] = null;
            self.times = null;
            self.data = null;
            return null
        },
        createValue: function() {
            return this.defaultValue
        },
        defaultValue: 0,
        setDefault: function(v) {
            this.defaultValue = v
        },
        interpolate: function(v1, v2, r, result) {
            result = v1 + (v2 - v1) * r;
            return result
        },
        set: function(result, value) {
            result = value;
            return result
        },
        getDefault: function(r) {
            r = this.defaultValue;
            return r
        },
        readValue: function(r) {
            return r.getInt32()
        },
        getValue: function(time, result) {
            var self = this;
            if (result === undefined) result = self.createValue();
            else result = self.getDefault(result);
            if (self.data.length > 1 && self.times.length > 1) {
                var maxTime = self.times[self.times.length - 1];
                if (maxTime > 0 && time > maxTime) time %= maxTime;
                var idx = 0,
                    numTimes = self.times.length;
                for (var i = 0; i < numTimes; ++i) {
                    if (time >= self.times[i] && time < self.times[i + 1]) {
                        idx = i;
                        break
                    }
                }
                var t1 = self.times[idx],
                    t2 = self.times[idx + 1],
                    r = 0;
                if (t1 != t2) r = (time - t1) / (t2 - t1);
                return self.interpolate(self.data[idx], self.data[idx + 1], r, result)
            } else if (self.data.length > 0) {
                result = self.set(result, self.data[0]);
                return result
            } else {
                return result
            }
        },
        read: function(r) {
            var self = this,
                i;
            var numTimes = r.getInt32();
            self.times = new Array(numTimes);
            for (i = 0; i < numTimes; ++i) {
                self.times[i] = r.getUint32()
            }
            var numData = r.getInt32();
            self.data = new Array(numData);
            for (i = 0; i < numData; ++i) {
                self.data[i] = self.readValue(r)
            }
        }
    };
    ZamModelViewer.Wow.SAnimatedVec2 = function(r) {
        var self = this;
        self.read(r)
    };
    ZamModelViewer.Wow.SAnimatedVec2.prototype = new ZamModelViewer.Wow.SAnimated;
    ZamModelViewer.Wow.SAnimatedVec2.prototype.constructor = ZamModelViewer.Wow.SAnimatedVec2;
    ZamModelViewer.Wow.SAnimatedVec2.prototype.createValue = function() {
        return vec2.clone(this.defaultValue)
    };
    ZamModelViewer.Wow.SAnimatedVec2.prototype.defaultValue = vec2.create();
    ZamModelViewer.Wow.SAnimatedVec2.prototype.getDefault = function(result) {
        vec2.copy(result, this.defaultValue);
        return result
    };
    ZamModelViewer.Wow.SAnimatedVec2.prototype.interpolate = function(v1, v2, r, result) {
        return vec2.lerp(result, v1, v2, r)
    };
    ZamModelViewer.Wow.SAnimatedVec2.prototype.set = function(result, value) {
        result[0] = value[0];
        result[1] = value[1];
        result[2] = value[2]
    };
    ZamModelViewer.Wow.SAnimatedVec2.prototype.readValue = function(r) {
        return vec2.set(vec2.create(), r.getFloat(), r.getFloat())
    };
    ZamModelViewer.Wow.SAnimatedVec2.getValue = function(dataset, anim, time, result) {
        return ZamModelViewer.Wow.Animated.getValue(ZamModelViewer.Wow.SAnimatedVec2.prototype, dataset, anim, time, result)
    };
    ZamModelViewer.Wow.SAnimatedVec3 = function(r) {
        var self = this;
        self.read(r)
    };
    ZamModelViewer.Wow.SAnimatedVec3.prototype = new ZamModelViewer.Wow.SAnimated;
    ZamModelViewer.Wow.SAnimatedVec3.prototype.constructor = ZamModelViewer.Wow.SAnimatedVec3;
    ZamModelViewer.Wow.SAnimatedVec3.prototype.createValue = function() {
        return vec3.clone(this.defaultValue)
    };
    ZamModelViewer.Wow.SAnimatedVec3.prototype.defaultValue = vec3.create();
    ZamModelViewer.Wow.SAnimatedVec3.prototype.getDefault = function(result) {
        vec3.copy(result, this.defaultValue);
        return result
    };
    ZamModelViewer.Wow.SAnimatedVec3.prototype.interpolate = function(v1, v2, r, result) {
        return vec3.lerp(result, v1, v2, r)
    };
    ZamModelViewer.Wow.SAnimatedVec3.prototype.set = function(result, value) {
        result[0] = value[0];
        result[1] = value[1];
        result[2] = value[2]
    };
    ZamModelViewer.Wow.SAnimatedVec3.prototype.readValue = function(r) {
        return vec3.set(vec3.create(), r.getFloat(), r.getFloat(), r.getFloat())
    };
    ZamModelViewer.Wow.SAnimatedVec3.getValue = function(dataset, anim, time, result) {
        return ZamModelViewer.Wow.Animated.getValue(ZamModelViewer.Wow.SAnimatedVec3.prototype, dataset, anim, time, result)
    };
    ZamModelViewer.Wow.SAnimatedUint16 = function(r) {
        var self = this;
        self.read(r)
    };
    ZamModelViewer.Wow.SAnimatedUint16.prototype = new ZamModelViewer.Wow.SAnimated;
    ZamModelViewer.Wow.SAnimatedUint16.prototype.constructor = ZamModelViewer.Wow.SAnimatedUint16;
    ZamModelViewer.Wow.SAnimatedUint16.prototype.readValue = function(r) {
        return r.getUint16()
    };
    ZamModelViewer.Wow.SAnimatedUint16.getValue = function(dataset, anim, time, result) {
        return ZamModelViewer.Wow.SAnimated.getValue(ZamModelViewer.Wow.SAnimatedUint16.prototype, dataset, anim, time, result)
    }
})();
ZamModelViewer.Wow.Texture = function(model, index, file) {
    var self = this,
        gl = model.renderer.context;
    self.model = model;
    self.index = index;
    self.url = model.opts.contentPath + "textures/" + file;
    self.alphaUrl = self.url.replace(".png", ".alpha.png");
    self.texture = null;
    self.alphaTexture = null;
    self.mergedImg = null;
    (function(self, gl) {
        self.img = new Image;
        self.img.crossOrigin = "";
        self.img.onload = function() {
            self.img.loaded = true;
            self.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, self.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        };
        self.img.onerror = function() {
            self.img = null
        };
        self.img.src = self.url;
        self.alphaImg = new Image;
        self.alphaImg.crossOrigin = "";
        self.alphaImg.onload = function() {
            if (self.alphaImg.width == 0 && self.alphaImg.height == 0) {
                self.alphaImg = null
            } else {
                self.alphaImg.loaded = true;
                self.alphaTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, self.alphaTexture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.alphaImg);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            }
        };
        self.alphaImg.onerror = function() {
            self.alphaImg = null
        };
        self.alphaImg.src = self.alphaUrl
    })(self, gl)
};
ZamModelViewer.Wow.Texture.prototype = {
    ready: function() {
        var self = this;
        if (self.img && !self.img.loaded) return false;
        if (self.alphaImg && !self.alphaImg.loaded) return false;
        return true
    },
    destroy: function() {
        var self = this;
        if (!self.model) return;
        var gl = self.model.renderer.context;
        if (self.texture) gl.deleteTexture(self.texture);
        if (self.alphaTexture) gl.deleteTexture(self.alphaTexture);
        self.texture = null;
        self.alphaTexture = null;
        self.img = self.alphaImg = self.mergedImg = null;
        self.model = null
    },
    mergeImages: function() {
        var self = this,
            i;
        if (self.mergedImg) return true;
        if (!self.ready()) return false;
        if (!self.alphaImg) {
            self.mergedImg = self.img;
            return true
        }
        var canvas = document.createElement("canvas");
        canvas.width = self.img.width;
        canvas.height = self.img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(self.img, 0, 0, self.img.width, self.img.height);
        var acanvas = document.createElement("canvas");
        acanvas.width = self.img.width;
        acanvas.height = self.img.height;
        var actx = acanvas.getContext("2d");
        actx.drawImage(self.alphaImg, 0, 0, self.alphaImg.width, self.alphaImg.height, 0, 0, self.img.width, self.img.height);
        var rgba = ctx.getImageData(0, 0, self.img.width, self.img.height),
            p = rgba.data;
        var alpha = actx.getImageData(0, 0, self.img.width, self.img.height),
            a = alpha.data;
        for (i = 0; i < p.length; i += 4) {
            p[i + 3] = a[i]
        }
        ctx.putImageData(rgba, 0, 0);
        self.mergedImg = canvas;
        return true
    }
};
ZamModelViewer.Wow.Item = function(model, slot, id, race, gender) {
    var self = this;
    self.model = model;
    self.slot = slot;
    self.uniqueSlot = ZamModelViewer.Wow.UniqueSlots[slot];
    self.sortValue = ZamModelViewer.Wow.SlotOrder[slot];
    self.models = null;
    self.geosets = null;
    self.textures = null;
    self.geoA = 0;
    self.geoB = 0;
    self.geoC = 0;
    self.loaded = false;
    if (id) {
        self.load(id, race, gender)
    }
};
ZamModelViewer.Wow.Item.prototype = {
    destroy: function() {
        var self = this,
            i;
        self.model = null;
        if (self.models) {
            for (i = 0; i < self.models.length; ++i) {
                if (self.models[i].model) self.models[i].model.destroy();
                self.models[i].model = null;
                self.models[i].attachment = null;
                self.models[i] = null
            }
            self.models = null
        }
        if (self.textures) {
            for (i = 0; i < self.textures; ++i) {
                if (self.textures[i].texture) self.textures[i].texture.destroy();
                self.textures[i].texture = null;
                self.textures[i] = null
            }
            self.textures = null
        }
        self.geosets = null
    },
    load: function(id, race, gender) {
        var self = this,
            Wow = ZamModelViewer.Wow;
        self.id = id;
        if (self.slot == Wow.Slots.SHOULDER) {
            self.models = new Array(2)
        } else if (Wow.SlotType[self.slot] != Wow.Types.ARMOR) {
            self.models = new Array(1)
        }
        if (self.models) {
            for (var i = 0; i < self.models.length; ++i) {
                self.models[i] = {
                    race: race,
                    gender: gender,
                    bone: -1,
                    attachment: null,
                    model: null
                };
                var modelInfo = {
                    type: Wow.SlotType[self.slot],
                    id: self.id,
                    parent: self.model
                };
                if (self.slot == Wow.Slots.SHOULDER) {
                    modelInfo.shoulder = i + 1
                }
                self.models[i].model = new Wow.Model(self.model.renderer, self.model.viewer, modelInfo, i)
            }
            self.loaded = true
        } else {
            var url = self.model.opts.contentPath + "meta/armor/" + self.slot + "/" + self.id + ".json";
            $.getJSON(url, function(data) {
                self.loadMeta(data)
            })
        }
    },
    loadMeta: function(meta) {
        var self = this,
            Wow = ZamModelViewer.Wow;
        self.slot = parseInt(meta.Slot);
        if (meta.Geosets) {
            self.geosets = [];
            for (var idx in meta.Geosets) {
                self.geosets.push({
                    index: parseInt(idx),
                    value: meta.Geosets[idx]
                })
            }
        }
        if (meta.GenderTextures) {
            self.textures = [];
            for (var g in meta.GenderTextures) {
                var gender = parseInt(g);
                if (g == self.model.gender && !self.model.npcTexture) {
                    var textures = meta.GenderTextures[g];
                    for (var r in textures) {
                        var region = parseInt(r);
                        var texture = {
                            region: region,
                            gender: gender,
                            file: textures[r],
                            texture: null
                        };
                        if (region > 0) {
                            texture.texture = new Wow.Texture(self.model, r, textures[r])
                        } else if (self.slot == Wow.Slots.CAPE) {
                            self.model.textureOverrides[2] = new Wow.Texture(self.model, 2, textures[r])
                        }
                        self.textures.push(texture)
                    }
                }
            }
        }
        self.geoA = meta.GeosetA;
        self.geoB = meta.GeosetB;
        self.geoC = meta.GeosetC;
        if (self.slot == Wow.Slots.HEAD) {
            self.model.hairVis = meta.ShowHair == 0;
            self.model.faceVis = meta.ShowFacial1 == 0
        } else if (self.slot == Wow.Slots.BELT && meta.GenderModels && meta.GenderModels[self.model.gender]) {
            var model = {
                race: 0,
                gender: 0,
                bone: -1,
                attachment: null,
                model: null
            };
            var modelInfo = {
                type: Wow.SlotType[self.slot],
                id: self.id,
                parent: self.model
            };
            model.model = new Wow.Model(self.model.renderer, self.model.viewer, modelInfo, 0, true);
            model.model.loadMeta(meta, Wow.Types.ARMOR);
            self.models = [model]
        } else if (self.slot == Wow.Slots.PANTS && self.geoC > 0) {
            self.sortValue += 2
        } else if (self.slot == Wow.Slots.HANDS && self.geoA > 0) {
            self.sortValue += 2
        }
        self.loaded = true;
        self.model.updateMeshes()
    }
};
ZamModelViewer.Wow.Vertex = function(r) {
    var self = this;
    self.position = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.normal = [r.getFloat(), r.getFloat(), r.getFloat(), 0];
    self.u = r.getFloat();
    self.v = r.getFloat();
    self.weights = [r.getUint8(), r.getUint8(), r.getUint8(), r.getUint8()];
    self.bones = [r.getUint8(), r.getUint8(), r.getUint8(), r.getUint8()];
    self.transPosition = vec3.clone(self.position);
    self.transNormal = vec4.clone(self.normal)
};
ZamModelViewer.Wow.Vertex.prototype = {
    destroy: function() {
        var self = this;
        self.position = null;
        self.normal = null;
        self.weights = null;
        self.bones = null;
        self.transPosition = null;
        self.transNormal = null
    }
};
ZamModelViewer.Wow.Animation = function(r) {
    var self = this,
        Wow = ZamModelViewer.Wow;
    self.id = r.getUint16();
    self.subId = r.getUint16();
    self.flags = r.getUint32();
    self.length = r.getUint32();
    self.speed = r.getFloat();
    self.next = r.getInt16();
    self.index = r.getUint16();
    self.available = r.getBool();
    if (self.available) {
        self.dbcFlags = r.getUint32();
        self.name = r.getString();
        var numData = r.getInt32();
        if (numData > 0) {
            self.translation = new Array(numData);
            self.rotation = new Array(numData);
            self.scale = new Array(numData);
            for (var i = 0; i < numData; ++i) {
                self.translation[i] = new Wow.AnimatedVec3(r);
                self.rotation[i] = new Wow.AnimatedQuat(r);
                self.scale[i] = new Wow.AnimatedVec3(r)
            }
        }
    }
};
ZamModelViewer.Wow.Animation.prototype = {
    destroy: function() {
        var self = this;
        if (!self.translation) return;
        for (var i = 0; i < self.translation.length; ++i) {
            self.translation[i].destroy();
            self.translation[i] = null;
            self.rotation[i].destroy();
            self.rotation[i] = null;
            self.scale[i].destroy();
            self.scale[i] = null
        }
        self.translation = null;
        self.rotation = null;
        self.scale = null
    }
};
ZamModelViewer.Wow.Bone = function(model, index, r) {
    var self = this;
    self.model = model;
    self.index = index;
    self.keyId = r.getInt32();
    self.parent = r.getInt16();
    self.mesh = r.getUint16();
    self.flags = r.getUint32();
    self.pivot = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.transformedPivot = vec3.create();
    self.matrix = mat4.create();
    self.tmpVec = vec3.create();
    self.tmpQuat = quat.create();
    self.tmpMat = mat4.create();
    self.hidden = false;
    self.updated = false
};
ZamModelViewer.Wow.Bone.prototype = {
    destroy: function() {
        var self = this;
        self.model = null;
        self.pivot = null;
        self.transformedPivot = null;
        self.matrix = null;
        self.tmpVec = null;
        self.tmpQuat = null;
        self.tmpMat = null
    },
    hide: function() {
        var self = this;
        self.hidden = true;
        for (var i = 0; i < 16; ++i) self.matrix[i] = 0
    },
    update: function(time) {
        var self = this,
            Wow = ZamModelViewer.Wow;
        if (self.hidden) {
            self.hide();
            return
        }
        if (self.model.model.type == Wow.Types.CHARACTER && !self.model.isHD) {
            if (self.model.race == Wow.Races.HUMAN && self.model.gender == Wow.Genders.MALE && self.index == 24) {
                self.hide()
            } else if (self.model.race == Wow.Races.WORGEN && self.model.gender == Wow.Genders.FEMALE && self.model.boneLookup[58] == self.index) {
                self.hide()
            }
        }
        if (self.updated) return;
        self.updated = true;
        if (!self.model || !self.model.animations) return;
        mat4.identity(self.matrix);
        var anim = self.model.currentAnimation;
        if (!anim || !anim.translation || !anim.rotation || !anim.scale) return;
        var billboard = (self.flags & 8) > 0;
        if (anim.translation[self.index].used || anim.rotation[self.index].used || anim.scale[self.index].used || billboard) {
            mat4.translate(self.matrix, self.matrix, self.pivot);
            if (anim.translation[self.index].used) {
                anim.translation[self.index].getValue(time, self.tmpVec);
                mat4.translate(self.matrix, self.matrix, self.tmpVec)
            }
            if (anim.rotation[self.index].used) {
                anim.rotation[self.index].getValue(time, self.tmpQuat);
                mat4.fromQuat(self.tmpMat, self.tmpQuat);
                mat4.transpose(self.tmpMat, self.tmpMat);
                mat4.multiply(self.matrix, self.matrix, self.tmpMat)
            }
            if (anim.scale[self.index].used) {
                anim.scale[self.index].getValue(time, self.tmpVec);
                if (self.tmpVec[0] > 10 || Math.abs(self.tmpVec[0]) < 1e-4) self.tmpVec[0] = 1;
                if (self.tmpVec[1] > 10 || Math.abs(self.tmpVec[1]) < 1e-4) self.tmpVec[1] = 1;
                if (self.tmpVec[2] > 10 || Math.abs(self.tmpVec[2]) < 1e-4) self.tmpVec[2] = 1;
                mat4.scale(self.matrix, self.matrix, self.tmpVec)
            }
            if (billboard) {
                var yRot = -self.model.renderer.zenith + Math.PI / 2;
                var zRot;
                if (self.model.model.type == Wow.Types.ITEM) {
                    zRot = self.model.renderer.azimuth - Math.PI
                } else {
                    zRot = self.model.renderer.azimuth - Math.PI * 1.5
                }
                mat4.identity(self.matrix);
                mat4.translate(self.matrix, self.matrix, self.pivot);
                mat4.rotateZ(self.matrix, self.matrix, zRot);
                mat4.rotateY(self.matrix, self.matrix, yRot)
            }
            mat4.translate(self.matrix, self.matrix, vec3.negate(self.tmpVec, self.pivot))
        }
        if (self.parent > -1) {
            self.model.bones[self.parent].update(time);
            mat4.multiply(self.matrix, self.model.bones[self.parent].matrix, self.matrix)
        }
        vec3.transformMat4(self.transformedPivot, self.pivot, self.matrix)
    }
};
ZamModelViewer.Wow.Mesh = function(r) {
    var self = this;
    self.id = r.getUint16();
    self.indexWrap = r.getUint16();
    self.vertexStart = r.getUint16();
    self.vertexCount = r.getUint16();
    self.indexStart = r.getUint16() + self.indexWrap * 65536;
    self.indexCount = r.getUint16();
    self.centerOfMass = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.centerBounds = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.radius = r.getFloat()
};
ZamModelViewer.Wow.Mesh.prototype = {
    destroy: function() {
        var self = this;
        self.centerOfMass = null;
        self.centerBounds = null
    }
};
ZamModelViewer.Wow.TexUnit = function(r) {
    var self = this;
    self.flags = r.getUint16();
    self.shading1 = r.getUint8();
    self.shading2 = r.getUint8();
    self.meshIndex = r.getUint16();
    self.mode = r.getUint16();
    self.colorIndex = r.getInt16();
    self.alphaIndex = r.getInt16();
    self.materialIndex = r.getInt16();
    self.textureAnimIndex = r.getInt16();
    self.renderFlagIndex = r.getUint16();
    self.texUnitIndex = r.getUint16();
    self.show = true;
    self.model = null;
    self.mesh = null;
    self.meshId = 0;
    self.renderFlag = null;
    self.material = null;
    self.textureAnim = null;
    self.color = null;
    self.alpha = null;
    self.unlit = false;
    self.cull = false;
    self.noZWrite = false;
    self.tmpColor = vec4.create();
    self.textureMatrix = mat4.create();
    self.tmpVec = vec3.create();
    self.tmpQuat = quat.create()
};
ZamModelViewer.Wow.TexUnit.prototype = {
    destroy: function() {
        var self = this;
        self.model = null;
        self.mesh = null;
        self.renderFlag = null;
        self.material = null;
        self.textureAnim = null;
        self.color = null;
        self.alpha = null;
        self.tmpColor = null;
        self.textureMatrix = null;
        self.tmpVec = null;
        self.tmpQuat = null
    },
    draw: function() {
        var self = this,
            gl = self.model.renderer.context,
            anim = self.model.currentAnimation.index,
            time = self.model.time;
        self.tmpColor[0] = self.tmpColor[1] = self.tmpColor[2] = self.tmpColor[3] = 1;
        if (self.color) {
            self.color.getValue(anim, time, self.tmpColor)
        }
        if (self.alpha) {
            self.tmpColor[3] *= self.alpha.getValue(anim, time)
        }
        if (self.tmpColor[3] <= .001) return;
        var blend = self.renderFlag.blend;
        if (self.meshId > 1500 && self.meshId < 1600) blend = 0;
        gl.uniform4fv(self.model.uniforms.fColor, self.tmpColor);
        gl.uniform1i(self.model.uniforms.fBlendMode, blend);
        gl.uniform1i(self.model.uniforms.fUnlit, self.unlit);
        var texture = null,
            alphaTexture = null;
        if (self.material) {
            if (self.material.type == 1) {
                if (self.model.npcTexture) {
                    texture = self.model.npcTexture.texture;
                    alphaTexture = self.model.npcTexture.alphaTexture
                } else if (self.model.compositeTexture) {
                    texture = self.model.compositeTexture
                }
            } else if (self.material.texture) {
                texture = self.material.texture.texture;
                alphaTexture = self.material.texture.alphaTexture
            } else if (((self.model.model.type < 8 || self.model.model.type > 32) && self.material.type == 2 || self.material.type >= 11) && self.model.textureOverrides[self.material.index]) {
                texture = self.model.textureOverrides[self.material.index].texture;
                alphaTexture = self.model.textureOverrides[self.material.index].alphaTexture
            } else if (self.material.type != -1 && self.model.textureOverrides[self.material.type]) {
                texture = self.model.textureOverrides[self.material.type].texture;
                alphaTexture = self.model.textureOverrides[self.material.type].alphaTexture
            } else if (self.material.type != -1 && self.model.specialTextures[self.material.type]) {
                texture = self.model.specialTextures[self.material.type].texture;
                alphaTexture = self.model.specialTextures[self.material.type].alphaTexture
            } else if (!self.material.filename) {
                var mat = self.model.materials[self.materialIndex];
                if (mat.texture) {
                    texture = mat.texture.texture;
                    alphaTexture = mat.texture.alphaTexture
                }
            }
        }
        if (texture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(self.model.uniforms.fTexture, 0)
        }
        if (alphaTexture) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, alphaTexture);
            gl.uniform1i(self.model.uniforms.fAlpha, 1)
        }
        gl.uniform1i(self.model.uniforms.fHasTexture, texture ? 1 : 0);
        gl.uniform1i(self.model.uniforms.fHasAlpha, alphaTexture ? 1 : 0);
        mat4.identity(self.textureMatrix);
        if (self.textureAnim) {
            var rotTrans = false;
            if (self.textureAnim.translation) {
                ZamModelViewer.Wow.AnimatedVec3.getValue(self.textureAnim.translation, anim, time, self.tmpVec);
                rotTrans = true
            } else {
                vec3.set(self.tmpVec, 0, 0, 0)
            }
            if (self.textureAnim.rotation) {
                ZamModelViewer.Wow.AnimatedQuat.getValue(self.textureAnim.rotation, anim, time, self.tmpQuat);
                rotTrans = true
            } else {
                quat.set(self.tmpQuat, 0, 0, 0, 1)
            }
            if (rotTrans) mat4.fromRotationTranslation(self.textureMatrix, self.tmpQuat, self.tmpVec);
            if (self.textureAnim.scale && ZamModelViewer.Wow.Animated.isUsed(self.textureAnim.scale, anim)) {
                ZamModelViewer.Wow.AnimatedVec3.getValue(self.textureAnim.scale, anim, time, self.tmpVec);
                mat4.scale(self.textureMatrix, self.textureMatrix, self.tmpVec)
            }
        }
        gl.uniformMatrix4fv(self.model.uniforms.vTextureMatrix, false, self.textureMatrix);
        if (blend == 0 || blend == 1) {
            gl.blendFunc(gl.ONE, gl.ZERO)
        } else if (blend == 2) {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        } else if (blend == 3) {
            gl.blendFunc(gl.SRC_COLOR, gl.ONE)
        } else if (blend == 4) {
            if (self.mode == 1 || self.mode == 2) {
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
            } else {
                gl.blendFunc(gl.ONE, gl.ONE)
            }
        } else if (blend == 5) {
            if (self.mode == 1) {
                gl.blendFunc(gl.ZERO, gl.SRC_COLOR)
            } else {
                gl.blendFunc(gl.DST_COLOR, gl.SRC_COLOR)
            }
        } else if (blend == 6) {
            gl.blendFunc(gl.DST_COLOR, gl.SRC_COLOR)
        } else {
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        }
        if (self.cull) {
            gl.enable(gl.CULL_FACE)
        } else {
            gl.disable(gl.CULL_FACE)
        }
        if (self.noZWrite) {
            gl.depthMask(false)
        } else {
            gl.depthMask(true)
        }
        gl.drawElements(gl.TRIANGLES, self.mesh.indexCount, gl.UNSIGNED_SHORT, self.mesh.indexStart * 2)
    },
    setup: function(model) {
        var self = this;
        self.model = model;
        self.mesh = model.meshes[self.meshIndex];
        self.meshId = self.mesh.id;
        self.renderFlag = model.renderFlags[self.renderFlagIndex];
        self.unlit = (self.renderFlag.flags & 1) > 0;
        self.cull = (self.renderFlag.flags & 4) == 0;
        self.noZWrite = (self.renderFlag.flags & 16) > 0;
        if (self.materialIndex > -1 && self.materialIndex < model.materialLookup.length) {
            var matIdx = model.materialLookup[self.materialIndex];
            if (matIdx > -1 && matIdx < model.materials.length) {
                self.material = model.materials[matIdx]
            }
        }
        if (self.textureAnimIndex > -1 && self.textureAnimIndex < model.textureAnimLookup.length) {
            var animIdx = model.textureAnimLookup[self.textureAnimIndex];
            if (animIdx > -1 && animIdx < model.textureAnims.length) {
                self.textureAnim = model.textureAnims[animIdx]
            }
        }
        if (self.colorIndex > -1 && self.colorIndex < model.colors.length) {
            self.color = model.colors[self.colorIndex]
        }
        if (self.alphaIndex > -1 && self.alphaIndex < model.alphaLookup.length) {
            var alphaIdx = model.alphaLookup[self.alphaIndex];
            if (alphaIdx > -1 && alphaIdx < model.alphas.length) {
                self.alpha = model.alphas[alphaIdx]
            }
        }
    }
};
ZamModelViewer.Wow.RenderFlag = function(r) {
    var self = this;
    self.flags = r.getUint16();
    self.blend = r.getUint16()
};
ZamModelViewer.Wow.Material = function(model, index, r) {
    var self = this;
    self.model = model;
    self.index = index;
    self.type = r.getInt32();
    self.flags = r.getUint32();
    self.filename = r.getString();
    self.texture = null;
    self.load()
};
ZamModelViewer.Wow.Material.prototype = {
    destroy: function() {
        var self = this;
        self.model = null;
        if (self.texture) self.texture.destroy();
        self.texture = null
    },
    load: function() {
        var self = this;
        if (self.filename.length == 0) return;
        self.texture = new ZamModelViewer.Wow.Texture(self.model, 0, self.filename)
    }
};
ZamModelViewer.Wow.TextureAnimation = function(r) {
    var Wow = ZamModelViewer.Wow;
    var self = this,
        i;
    var numTrans = r.getInt32();
    if (numTrans > 0) {
        self.translation = new Array(numTrans);
        for (i = 0; i < numTrans; ++i) self.translation[i] = new Wow.AnimatedVec3(r)
    } else self.translation = null;
    var numRot = r.getInt32();
    if (numRot > 0) {
        self.rotation = new Array(numRot);
        for (i = 0; i < numRot; ++i) self.rotation[i] = new Wow.AnimatedQuat(r)
    } else self.rotation = null;
    var numScale = r.getInt32();
    if (numScale > 0) {
        self.scale = new Array(numScale);
        for (i = 0; i < numScale; ++i) self.scale[i] = new Wow.AnimatedVec3(r)
    } else self.scale = null
};
ZamModelViewer.Wow.TextureAnimation.prototype = {
    destroy: function() {
        var self = this,
            i;
        if (self.translation) {
            for (i = 0; i < self.translation.length; ++i) self.translation[i] = self.translation[i].destroy();
            self.translation = null
        }
        if (self.rotation) {
            for (i = 0; i < self.rotation.length; ++i) self.rotation[i] = self.rotation[i].destroy();
            self.rotation = null
        }
        if (self.scale) {
            for (i = 0; i < self.scale.length; ++i) self.scale[i] = self.scale[i].destroy();
            self.scale = null
        }
    }
};
ZamModelViewer.Wow.Attachment = function(r) {
    var self = this;
    self.id = r.getInt32();
    self.bone = r.getInt32();
    self.position = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.slot = -1
};
ZamModelViewer.Wow.Attachment.prototype = {
    destroy: function() {
        var self = this;
        self.position = null
    }
};
ZamModelViewer.Wow.Color = function(r) {
    var Wow = ZamModelViewer.Wow;
    var self = this,
        i;
    var numRgb = r.getInt32();
    if (numRgb > 0) {
        self.rgb = new Array(numRgb);
        for (i = 0; i < numRgb; ++i) {
            self.rgb[i] = new Wow.AnimatedVec3(r)
        }
    }
    var numAlpha = r.getInt32();
    if (numAlpha > 0) {
        self.alpha = new Array(numAlpha);
        for (i = 0; i < numAlpha; ++i) {
            self.alpha[i] = new Wow.AnimatedUint16(r)
        }
    }
};
ZamModelViewer.Wow.Color.prototype = {
    destroy: function() {
        var self = this,
            i;
        if (self.rgb) {
            for (i = 0; i < self.rgb.length; ++i) self.rgb[i] = self.rgb[i].destroy();
            self.rgb = null
        }
        if (self.alpha) {
            for (i = 0; i < self.alpha.length; ++i) self.alpha[i] = self.alpha[i].destroy();
            self.alpha = null
        }
    },
    rgbUsed: function(anim) {
        var self = this;
        if (!self.rgb) return false;
        if (anim < self.rgb.length) return self.rgb[anim].used;
        else return self.rgb[0].used
    },
    alphaUsed: function(anim) {
        var self = this;
        if (!self.alpha) return false;
        if (anim < self.alpha.length) return self.alpha[anim].used;
        else return self.alpha[0].used
    },
    used: function(anim) {
        var self = this;
        return self.rgbUsed(anim) || self.alphaUsed(anim)
    },
    getValue: function(anim, time, result) {
        var self = this;
        if (!result) result = [1, 1, 1, 1];
        else result[0] = result[1] = result[2] = result[3] = 1;
        if (self.rgbUsed(anim)) ZamModelViewer.Wow.AnimatedVec3.getValue(self.rgb, anim, time, result);
        if (self.alphaUsed(anim)) result[3] = ZamModelViewer.Wow.AnimatedUint16.getValue(self.alpha, anim, time, result[3]) / 32767;
        return result
    }
};
ZamModelViewer.Wow.Alpha = function(r) {
    var self = this;
    var count = r.getInt32();
    self.data = new Array(count);
    for (var i = 0; i < count; ++i) {
        self.data[i] = new ZamModelViewer.Wow.AnimatedUint16(r)
    }
};
ZamModelViewer.Wow.Alpha.prototype = {
    destroy: function() {
        var self = this;
        for (var i = 0; i < self.data.length; ++i) self.data[i] = self.data[i].destroy();
        self.data = null
    },
    used: function(anim) {
        var self = this;
        if (self.data.length == 0) return false;
        if (anim < self.data.length) return self.data[anim].used;
        else return self.data[0].used
    },
    getValue: function(anim, time) {
        var self = this,
            a = 1;
        if (self.used(anim)) {
            var val = ZamModelViewer.Wow.AnimatedUint16.getValue(self.data, anim, time, a);
            a = val / 32767
        }
        if (a > 1) a = 1;
        else if (a < 0) a = 0;
        return a
    }
};
ZamModelViewer.Wow.ParticleEmitter = function(model, r) {
    var self = this,
        Wow = ZamModelViewer.Wow;
    self.model = model;
    self.id = r.getInt32();
    self.flags = r.getUint32();
    self.flags2 = r.getUint16();
    self.position = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.boneId = r.getInt16();
    self.textureId = r.getInt16();
    self.blendMode = r.getUint8();
    self.emitterType = r.getUint8();
    self.particleType = r.getUint8();
    self.headTail = r.getUint8();
    self.tileRotation = r.getUint16();
    self.tileRows = r.getUint16();
    self.tileColumns = r.getUint16();
    self.scale = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.slowdown = r.getFloat();
    self.rotation = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.modelRot1 = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.modelRot2 = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.modelTranslation = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.modelPath = r.getString();
    self.particlePath = r.getString();
    self.emissionSpeed = Wow.AnimatedFloat.readSet(r);
    self.speedVariation = Wow.AnimatedFloat.readSet(r);
    self.verticalRange = Wow.AnimatedFloat.readSet(r);
    self.horizontalRange = Wow.AnimatedFloat.readSet(r);
    self.gravity = Wow.AnimatedFloat.readSet(r);
    self.lifespan = Wow.AnimatedFloat.readSet(r);
    self.emissionRate = Wow.AnimatedFloat.readSet(r);
    self.areaLength = Wow.AnimatedFloat.readSet(r);
    self.areaWidth = Wow.AnimatedFloat.readSet(r);
    self.gravity2 = Wow.AnimatedFloat.readSet(r);
    self.color = new Wow.SAnimatedVec3(r);
    self.alpha = new Wow.SAnimatedUint16(r);
    self.size = new Wow.SAnimatedVec2(r);
    self.intensity = new Wow.SAnimatedUint16(r);
    self.enabled = Wow.AnimatedUint8.readSet(r);
    self.bone = self.model.bones[self.boneId];
    self.maxParticles = 500;
    self.particles = new Array(self.maxParticles);
    self.unusedParticles = new Array(self.maxParticles);
    for (var i = self.maxParticles - 1, j = 0; i >= 0; --i, ++j) self.unusedParticles[i] = j;
    self.nextParticle = self.maxParticles - 1;
    self.numParticles = 0;
    self.spawnRemainder = 0;
    self.tmpColors = [vec4.create(), vec4.create(), vec4.create()];
    self.spreadMat = mat4.create();
    self.tmpMat = mat4.create();
    self.init()
};
ZamModelViewer.Wow.ParticleEmitter.prototype = {
    destroy: function() {
        var self = this,
            gl = self.model.renderer.context,
            Animated = ZamModelViewer.Wow.Animated;
        if (self.program) gl.deleteProgram(self.program);
        if (self.vs) gl.deleteShader(self.vs);
        if (self.fs) gl.deleteShader(self.fs);
        if (self.vb) gl.deleteBuffer(self.vb);
        if (self.ib) gl.deleteBuffer(self.ib);
        self.program = null;
        self.vs = null;
        self.fs = null;
        self.vb = null;
        self.ib = null;
        self.vbData = null;
        self.texture = null;
        self.attribs = null;
        self.uniforms = null;
        self.model = null;
        self.bone = null;
        self.position = null;
        self.scale = null;
        self.rotation = null;
        self.modelRot1 = null;
        self.modelRot2 = null;
        self.modelTranslation = null;
        self.emissionSpeed = Animated.destroySet(self.emissionSpeed);
        self.speedVariation = Animated.destroySet(self.speedVariation);
        self.verticalRange = Animated.destroySet(self.verticalRange);
        self.horizontalRange = Animated.destroySet(self.horizontalRange);
        self.gravity = Animated.destroySet(self.gravity);
        self.lifespan = Animated.destroySet(self.lifespan);
        self.emissionRate = Animated.destroySet(self.emissionRate);
        self.areaLength = Animated.destroySet(self.areaLength);
        self.areaWidth = Animated.destroySet(self.areaWidth);
        self.gravity2 = Animated.destroySet(self.gravity2);
        self.enabled = Animated.destroySet(self.enabled);
        self.color = self.color.destroy();
        self.alpha = self.alpha.destroy();
        self.size = self.size.destroy();
        self.intensity = self.intensity.destroy();
        self.particles = null;
        self.unusedParticles = null;
        self.tmpColors[0] = self.tmpColors[1] = self.tmpColors[2] = null;
        self.tmpColors = null;
        self.spreadMat = null;
        self.tmpMat = null
    },
    updateBuffers: function() {
        var self = this,
            gl = self.model.renderer.context,
            i, j;
        if (!self.vbData) {
            self.vbData = new Float32Array(self.maxParticles * 11);
            var ibData = new Uint16Array(self.maxParticles * 6);
            var vert = 0;
            for (i = 0; i < self.maxParticles; ++i) {
                ibData[i * 6 + 0] = vert;
                ibData[i * 6 + 1] = vert + 1;
                ibData[i * 6 + 2] = vert + 2;
                ibData[i * 6 + 3] = vert + 2;
                ibData[i * 6 + 4] = vert + 1;
                ibData[i * 6 + 5] = vert + 3;
                vert += 4
            }
            self.ib = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.ib);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ibData, gl.STATIC_DRAW)
        }
        self.numParticles = 0;
        var p, idx = 0,
            tc, vbData = self.vbData;
        if (self.particleType == 0 || self.particleType == 2) {
            for (i = 0; i < self.maxParticles; ++i) {
                p = self.particles[i];
                if (!p || p.maxLife == 0) continue;
                tc = self.textureCoords[p.tile];
                for (j = 0; j < 4; ++j) {
                    vbData[idx + 0] = p.position[0];
                    vbData[idx + 1] = p.position[1];
                    vbData[idx + 2] = p.position[2];
                    vbData[idx + 3] = p.color[0];
                    vbData[idx + 4] = p.color[1];
                    vbData[idx + 5] = p.color[2];
                    vbData[idx + 6] = p.color[3];
                    vbData[idx + 7] = tc[j].x;
                    vbData[idx + 8] = tc[j].y;
                    vbData[idx + 9] = tc[j].z * p.size[0];
                    vbData[idx + 10] = tc[j].w * p.size[1];
                    idx += 11
                }
                self.numParticles++
            }
        } else {
            for (i = 0; i < self.maxParticles; ++i) {
                p = self.particles[i];
                if (!p || p.maxLife == 0) continue;
                tc = self.textureCoords[p.tile];
                vbData[idx + 0] = p.position[0];
                vbData[idx + 1] = p.position[1];
                vbData[idx + 2] = p.position[2];
                vbData[idx + 11] = p.position[0];
                vbData[idx + 12] = p.position[1];
                vbData[idx + 13] = p.position[2];
                vbData[idx + 22] = p.origin[0];
                vbData[idx + 23] = p.origin[1];
                vbData[idx + 24] = p.origin[2];
                vbData[idx + 33] = p.origin[0];
                vbData[idx + 34] = p.origin[1];
                vbData[idx + 35] = p.origin[2];
                for (j = 0; j < 4; ++j) {
                    vbData[idx + 3] = p.color[0];
                    vbData[idx + 4] = p.color[1];
                    vbData[idx + 5] = p.color[2];
                    vbData[idx + 6] = p.color[3];
                    vbData[idx + 7] = tc[j].x;
                    vbData[idx + 8] = tc[j].y;
                    vbData[idx + 9] = tc[j].z * p.size[0];
                    vbData[idx + 10] = tc[j].w * p.size[1];
                    idx += 11
                }
                self.numParticles++
            }
        }
        if (!self.vb) {
            self.vb = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
            gl.bufferData(gl.ARRAY_BUFFER, self.vbData, gl.DYNAMIC_DRAW)
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, self.vbData)
        }
    },
    draw: function() {
        var self = this,
            gl = self.model.renderer.context,
            i;
        if (self.numParticles == 0) return;
        if (!self.shaderReady) self.initShader();
        if (!self.program) return;
        if (!self.texture && self.textureId > -1 && self.textureId < self.model.materials.length) {
            var mat = self.model.materials[self.textureId];
            if (mat.texture && mat.texture.texture && (!mat.texture.alphaImg || mat.texture.alphaTexture)) {
                self.texture = mat.texture
            }
        }
        if (!self.texture) return;
        gl.useProgram(self.program);
        gl.uniformMatrix4fv(self.uniforms.vModelMatrix, false, self.model.matrix);
        gl.uniformMatrix4fv(self.uniforms.vViewMatrix, false, self.model.renderer.viewMatrix);
        gl.uniformMatrix4fv(self.uniforms.vProjMatrix, false, self.model.renderer.projMatrix);
        gl.uniform1i(self.uniforms.fBlendMode, self.blendMode);
        if (self.texture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, self.texture.texture);
            gl.uniform1i(self.uniforms.fTexture, 0)
        }
        if (self.texture && self.texture.alphaTexture) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, self.texture.alphaTexture);
            gl.uniform1i(self.uniforms.fAlpha, 1)
        }
        gl.uniform1i(self.uniforms.fHasTexture, self.texture ? 1 : 0);
        gl.uniform1i(self.uniforms.fHasAlpha, self.texture && self.texture.alphaTexture ? 1 : 0);
        var blend = self.blendMode;
        if (blend == 0 || blend == 1) {
            gl.blendFunc(gl.ONE, gl.ZERO)
        } else if (blend == 2) {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        } else if (blend == 3) {
            gl.blendFunc(gl.SRC_COLOR, gl.ONE)
        } else if (blend == 4) {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
        } else if (blend == 5 || blend == 6) {
            gl.blendFunc(gl.DST_COLOR, gl.SRC_COLOR)
        } else {
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        }
        gl.disable(gl.CULL_FACE);
        gl.depthMask(false);
        gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.ib);
        for (i in self.attribs) {
            var a = self.attribs[i];
            gl.enableVertexAttribArray(a.loc);
            gl.vertexAttribPointer(a.loc, a.size, a.type, false, a.stride, a.offset)
        }
        gl.drawElements(gl.TRIANGLES, self.numParticles * 6, gl.UNSIGNED_SHORT, 0);
        for (i in self.attribs) {
            gl.disableVertexAttribArray(self.attribs[i].loc)
        }
    },
    initShader: function() {
        var self = this,
            gl = self.model.renderer.context;
        self.shaderReady = true;
        var vs = self.model.renderer.compileShader(gl.VERTEX_SHADER, self.vertShader);
        var fs = self.model.renderer.compileShader(gl.FRAGMENT_SHADER, self.fragShader);
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Error linking shaders");
            return
        }
        self.vs = vs;
        self.fs = fs;
        self.program = program;
        self.uniforms = {
            vModelMatrix: gl.getUniformLocation(program, "uModelMatrix"),
            vViewMatrix: gl.getUniformLocation(program, "uViewMatrix"),
            vProjMatrix: gl.getUniformLocation(program, "uProjMatrix"),
            fHasTexture: gl.getUniformLocation(program, "uHasTexture"),
            fHasAlpha: gl.getUniformLocation(program, "uHasAlpha"),
            fBlendMode: gl.getUniformLocation(program, "uBlendMode"),
            fTexture: gl.getUniformLocation(program, "uTexture"),
            fAlpha: gl.getUniformLocation(program, "uAlpha")
        };
        self.attribs = {
            position: {
                loc: gl.getAttribLocation(program, "aPosition"),
                type: gl.FLOAT,
                size: 3,
                offset: 0,
                stride: 44
            },
            normal: {
                loc: gl.getAttribLocation(program, "aColor"),
                type: gl.FLOAT,
                size: 4,
                offset: 12,
                stride: 44
            },
            texcoord: {
                loc: gl.getAttribLocation(program, "aTexCoord"),
                type: gl.FLOAT,
                size: 4,
                offset: 28,
                stride: 44
            }
        }
    },
    vertShader: "        attribute vec3 aPosition;        attribute vec4 aColor;        attribute vec4 aTexCoord;                varying vec4 vColor;        varying vec2 vTexCoord;                uniform mat4 uModelMatrix;        uniform mat4 uViewMatrix;        uniform mat4 uProjMatrix;                void main(void) {            vec4 pos = uViewMatrix * uModelMatrix * vec4(aPosition, 1);            pos.xy += aTexCoord.zw;            gl_Position = uProjMatrix * pos;                        vTexCoord = aTexCoord.xy;            vColor = aColor;        }    ",
    fragShader: "        precision mediump float;                varying vec4 vColor;        varying vec2 vTexCoord;                uniform bool uHasTexture;        uniform bool uHasAlpha;        uniform int uBlendMode;        uniform sampler2D uTexture;        uniform sampler2D uAlpha;                void main(void) {            vec4 color = vec4(1, 1, 1, 1);            if (uHasTexture) {                color = texture2D(uTexture, vTexCoord.st);            }            if ((uBlendMode == 1 || uBlendMode == 2 || uBlendMode == 4) && uHasAlpha) {                color.a = texture2D(uAlpha, vTexCoord.st).r;            }                        color *= vColor;                        if (uBlendMode == 1) {                if (color.a < 0.7) { discard; }            }                        gl_FragColor = color;        }    ",
    update: function(anim, time, delta) {
        var self = this,
            Wow = ZamModelViewer.Wow;
        var grav = Wow.AnimatedFloat.getValue(self.gravity, anim, time);
        var deaccel = Wow.AnimatedFloat.getValue(self.gravity2, anim, time);
        var speed, i, j;
        if (self.emitterType == 1 || self.emitterType == 2) {
            var rate = Wow.AnimatedFloat.getValue(self.emissionRate, anim, time);
            var life = Wow.AnimatedFloat.getValue(self.lifespan, anim, time);
            var toSpawn = 0;
            if (life != 0) toSpawn = delta * rate / life + self.spawnRemainder;
            else toSpawn = self.spawnRemainder;
            if (toSpawn < 1) {
                self.spawnRemainder = toSpawn;
                if (self.spawnRemainder < 0) self.spawnRemainder = 0
            } else {
                var count = Math.min(Math.floor(toSpawn), self.nextParticle + 1);
                self.spawnRemainder = toSpawn - count;
                var en = true;
                if (Wow.Animated.isUsed(self.enabled, anim)) en = Wow.AnimatedUint8.getValue(self.enabled, anim, time) != 0;
                if (en && count > 0) {
                    var w = Wow.AnimatedFloat.getValue(self.areaWidth, anim, time) * .5;
                    var l = Wow.AnimatedFloat.getValue(self.areaLength, anim, time) * .5;
                    speed = Wow.AnimatedFloat.getValue(self.emissionSpeed, anim, time);
                    var vary = Wow.AnimatedFloat.getValue(self.speedVariation, anim, time);
                    if (self.emitterType == 1) {
                        for (i = 0; i < count; ++i) self.spawnPlaneParticle(w, l, speed, vary, life)
                    } else {
                        var vSpread = Wow.AnimatedFloat.getValue(self.verticalRange, anim, time);
                        var hSpread = Wow.AnimatedFloat.getValue(self.horizontalRange, anim, time);
                        for (i = 0; i < count; ++i) self.spawnSphereParticle(w, l, speed, vary, vSpread, hSpread)
                    }
                }
            }
            if (isNaN(self.spawnRemainder)) self.spawnRemainder = 0
        }
        speed = 1;
        var gravDelta = grav * delta;
        var deaccelDelta = deaccel * delta;
        var speedDelta = speed * delta;
        var p, lifePos, limit, v, s1, s2, s3;
        s1 = self.size.data[0];
        if (self.size.data.length > 2) {
            s2 = self.size.data[1];
            s3 = self.size.data[2]
        } else if (self.size.data.length > 1) {
            s2 = self.size.data[1];
            s3 = s2
        } else {
            s3 = s2 = s1
        }
        for (i = 0; i < self.maxParticles; ++i) {
            p = self.particles[i];
            if (!p || p.maxLife == 0) continue;
            p.life += delta;
            lifePos = p.life / p.maxLife;
            if (lifePos >= 1) {
                p.maxLife = 0;
                self.nextParticle++;
                self.unusedParticles[self.nextParticle] = p.index;
                continue
            }
            vec3.scaleAndAdd(p.speed, p.speed, p.down, gravDelta);
            vec3.scaleAndAdd(p.speed, p.speed, p.direction, -deaccelDelta);
            if (self.slowdown > 0) {
                speed = Math.exp(-1 * self.slowdown * p.life);
                speedDelta = speed * delta
            }
            vec3.scaleAndAdd(p.position, p.position, p.speed, speedDelta);
            if (lifePos <= .5) {
                vec2.lerp(p.size, s1, s2, lifePos / .5)
            } else {
                vec2.lerp(p.size, s2, s3, (lifePos - .5) / .5)
            }
            vec2.multiply(p.size, p.size, self.scale);
            limit = Math.min(3, self.color.data.length);
            for (j = 0; j < limit; ++j) {
                v = self.color.data[j];
                vec4.set(self.tmpColors[j], v[0] / 255, v[1] / 255, v[2] / 255, self.alpha.data[j] / 32767)
            }
            if (limit < 3) {
                v = self.color.data[limit - 1];
                for (j = limit; j < 3; ++j) vec4.set(self.tmpColors[j], v[0] / 255, v[1] / 255, v[2] / 255, self.alpha.data[j] / 32767)
            }
            if (lifePos <= .5) {
                vec4.lerp(p.color, self.tmpColors[0], self.tmpColors[1], lifePos / .5)
            } else {
                vec4.lerp(p.color, self.tmpColors[1], self.tmpColors[2], (lifePos - .5) / .5)
            }
        }
        self.updateBuffers()
    },
    getNextParticle: function() {
        var self = this;
        if (self.nextParticle < 0) return null;
        var index = self.unusedParticles[self.nextParticle];
        if (!self.particles[index]) {
            self.particles[index] = {
                index: index,
                position: vec3.create(),
                origin: vec3.create(),
                speed: vec4.create(),
                direction: vec4.create(),
                down: vec3.create(),
                color: vec4.create(),
                size: vec2.create(),
                life: 0,
                maxLife: 0,
                tile: 0
            }
        }
        self.nextParticle--;
        return self.particles[index]
    },
    spawnPlaneParticle: function(width, height, speed, vary, life) {
        var self = this,
            p = self.getNextParticle();
        if (!p) return null;
        vec3.copy(p.position, self.position);
        p.position[0] += -width / 2 + width * Math.random();
        p.position[1] += -height / 2 + height * Math.random();
        vec3.transformMat4(p.position, p.position, self.bone.matrix);
        vec4.set(p.direction, 0, 0, 1, 0);
        vec4.transformMat4(p.direction, p.direction, self.bone.matrix);
        vec3.normalize(p.direction, p.direction);
        vec4.copy(p.speed, p.direction);
        var v1 = speed - speed * vary,
            v2 = speed + speed * vary;
        vec4.scale(p.speed, p.speed, v1 + (v2 - v1) * Math.random());
        vec3.set(p.down, 0, 0, -1);
        p.life = 0;
        p.maxLife = life;
        if (!p.maxLife) p.maxLife = 1;
        vec3.copy(p.origin, p.position);
        p.tile = Math.floor(Math.random() * self.tileRows * self.tileColumns);
        vec4.set(p.color, 1, 1, 1, 1);
        return p
    },
    spawnSphereParticle: function(width, height, speed, vary, spread, spread2, life) {
        var self = this,
            p = self.getNextParticle();
        if (!p) return null;
        var radius = Math.random(),
            t = 0;
        if (spread == 0) {
            t = Math.random() * Math.PI * 2 - Math.PI
        } else {
            t = Math.random() * spread * 2 - spread
        }
        self.calcSpread(spread * 2, spread * 2, width, height);
        if ((self.flags & 57) == 57 || (self.flags & 313) == 313) {
            vec3.copy(p.position, self.position);
            vec4.set(p.direction, width * Math.cos(t) * 1.6, height * Math.sin(t) * 1.6, 0, 0);
            vec3.add(p.position, p.position, p.direction);
            vec3.transformMat4(p.position, p.position, self.bone.matrix);
            if (vec3.squaredLength(p.direction) == 0) {
                vec4.set(p.speed, 0, 0, 0, 0)
            } else {
                vec4.transformMat4(p.direction, p.direction, self.bone.matrix);
                vec3.normalize(p.direction, p.direction);
                vec3.copy(p.speed, p.direction);
                vec3.scale(p.speed, p.speed, speed * (1 + Math.random() * vary * 2 - vary))
            }
        } else {
            vec4.set(p.direction, 0, 0, 1, 0);
            vec4.transformMat4(p.direction, p.direction, self.spreadMat);
            vec3.scale(p.direction, p.direction, radius);
            vec3.copy(p.position, self.position);
            vec3.add(p.position, p.position, p.direction);
            vec3.transformMat4(p.position, p.position, self.bone.matrix);
            if (vec3.squaredLength(p.direction) == 0 && (self.flags & 256) == 0) {
                vec4.set(p.speed, 0, 0, 0, 0);
                vec4.set(p.direction, 0, 0, 1, 0);
                vec4.transformMat4(p.direction, p.direction, self.bone.matrix);
                vec3.normalize(p.direction, p.direction)
            } else {
                if ((self.flags & 256) > 0) {
                    vec4.set(p.direction, 0, 0, 1, 0);
                    vec4.transformMat4(p.direction, p.direction, self.bone.matrix)
                }
                vec3.normalize(p.direction, p.direction);
                vec4.copy(p.speed, p.direction);
                vec3.scale(p.speed, p.speed, speed * (1 + Math.random() * vary * 2 - vary))
            }
        }
        vec3.set(p.down, 0, 0, -1);
        p.life = 0;
        p.maxLife = life;
        if (!p.maxLife) p.maxLife = 1;
        vec3.copy(p.origin, p.position);
        p.tile = Math.floor(Math.random() * self.tileRows * self.tileColumns);
        vec4.set(p.color, 1, 1, 1, 1);
        return p
    },
    calcSpread: function(spread1, spread2, width, height) {
        var self = this,
            mat = this.spreadMat,
            tmpMat = this.tmpMat;
        var a0 = (Math.random() * (spread1 * 2) - spread1) / 2,
            a1 = (Math.random() * (spread2 * 2) - spread2) / 2;
        var c0 = Math.cos(a0),
            c1 = Math.cos(a1),
            s0 = Math.sin(a0),
            s1 = Math.sin(a1);
        mat4.identity(mat);
        mat4.identity(tmpMat);
        tmpMat[5] = tmpMat[10] = c0;
        tmpMat[9] = s0;
        tmpMat[6] = -s0;
        mat4.multiply(mat, mat, tmpMat);
        mat4.identity(tmpMat);
        tmpMat[0] = tmpMat[10] = c1;
        tmpMat[2] = s1;
        tmpMat[8] = -s1;
        mat4.multiply(mat, mat, tmpMat);
        var size = Math.abs(c0) * height * Math.abs(s0) * width;
        mat[0] *= size;
        mat[1] *= size;
        mat[2] *= size;
        mat[4] *= size;
        mat[5] *= size;
        mat[6] *= size;
        mat[8] *= size;
        mat[9] *= size;
        mat[10] *= size;
        mat4.multiply(mat, self.bone.matrix, mat);
        return mat
    },
    init: function() {
        var self = this;
        if (self.scale.z == 519) self.scale.z = 1.5;
        var numTiles = self.tileRows * self.tileColumns;
        self.textureCoords = new Array(numTiles);
        var a = {
                x: 0,
                y: 0
            },
            b = {
                x: 0,
                y: 0
            };
        var i, x, y;
        for (i = 0; i < numTiles; ++i) {
            x = i % self.tileColumns;
            y = Math.floor(i / self.tileColumns);
            a.x = x * (1 / self.tileColumns);
            b.x = (x + 1) * (1 / self.tileColumns);
            a.y = y * (1 / self.tileRows);
            b.y = (y + 1) * (1 / self.tileRows);
            self.textureCoords[i] = [{
                x: a.x,
                y: a.y,
                z: -1,
                w: 1
            }, {
                x: b.x,
                y: a.y,
                z: 1,
                w: 1
            }, {
                x: a.x,
                y: b.y,
                z: -1,
                w: -1
            }, {
                x: b.x,
                y: b.y,
                z: 1,
                w: -1
            }]
        }
    }
};
ZamModelViewer.Wow.RibbonEmitter = function(model, r) {
    var self = this,
        Wow = ZamModelViewer.Wow,
        i;
    self.model = model;
    self.id = r.getInt32();
    self.boneId = r.getInt32();
    self.position = [r.getFloat(), r.getFloat(), r.getFloat()];
    self.resolution = r.getFloat();
    self.length = r.getFloat();
    self.emissionAngle = r.getFloat();
    self.s1 = r.getInt16();
    self.s2 = r.getInt16();
    var count = r.getInt32();
    if (count > 0) {
        self.textureIds = new Array(count);
        for (i = 0; i < count; ++i) {
            self.textureIds[i] = r.getInt32()
        }
    }
    self.color = Wow.AnimatedVec3.readSet(r);
    self.alpha = Wow.AnimatedUint16.readSet(r);
    self.above = Wow.AnimatedFloat.readSet(r);
    self.below = Wow.AnimatedFloat.readSet(r);
    self.bone = self.model.bones[self.boneId];
    self.maxSegments = 50;
    self.segments = new Array(self.maxSegments);
    for (i = 0; i < self.maxSegments; ++i) {
        self.segments[i] = {
            position: vec3.create(),
            start: vec3.create(),
            up: vec4.create(),
            length: 0
        }
    }
    self.currentSegment = 0;
    self.numSegments = 0;
    self.totalLength = self.resolution / self.length;
    self.currentPosition = vec3.clone(self.position);
    self.currentColor = vec4.create();
    self.currentAbove = 0;
    self.currentBelow = 0;
    self.currentLength = 0;
    self.tmpPosition = vec3.create();
    self.tmpUp = vec4.create();
    self.tmpVec = vec4.create()
};
ZamModelViewer.Wow.RibbonEmitter.prototype = {
    destroy: function() {
        var self = this,
            gl = self.model.renderer.context,
            Animated = ZamModelViewer.Wow.Animated;
        if (self.program) gl.deleteProgram(self.program);
        if (self.vs) gl.deleteShader(self.vs);
        if (self.fs) gl.deleteShader(self.fs);
        if (self.vb) gl.deleteBuffer(self.vb);
        if (self.ib) gl.deleteBuffer(self.ib);
        self.program = null;
        self.vs = null;
        self.fs = null;
        self.vb = null;
        self.ib = null;
        self.vbData = null;
        self.uniforms = null;
        self.attribs = null;
        self.texture = null;
        self.model = null;
        self.bone = null;
        self.position = null;
        self.textureIds = null;
        for (var i = 0; i < self.maxSegments; ++i) {
            self.segments[i].position = null;
            self.segments[i].start = null;
            self.segments[i].up = null;
            self.segments[i] = null
        }
        self.segments = null;
        self.currentPosition = null;
        self.currentColor = null;
        self.tmpPosition = null;
        self.tmpUp = null;
        self.tmpVec = null;
        self.color = Animated.destroySet(self.color);
        self.alpha = Animated.destroySet(self.alpha);
        self.above = Animated.destroySet(self.above);
        self.below = Animated.destroySet(self.below)
    },
    updateBuffers: function() {
        var self = this,
            gl = self.model.renderer.context,
            i, j;
        if (!self.vbData) {
            self.vbData = new Float32Array((self.maxSegments * 2 + 2) * 5);
            var ibData = new Uint16Array(self.maxSegments * 6);
            var vert = 0;
            for (i = 0; i < self.maxSegments; ++i) {
                ibData[i * 6 + 0] = vert;
                ibData[i * 6 + 1] = vert + 1;
                ibData[i * 6 + 2] = vert + 2;
                ibData[i * 6 + 3] = vert + 2;
                ibData[i * 6 + 4] = vert + 1;
                ibData[i * 6 + 5] = vert + 3;
                vert += 2
            }
            self.ib = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.ib);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ibData, gl.STATIC_DRAW)
        }
        if (self.numSegments == 0) return;
        var s = self.segments[self.currentSegment],
            n = 0,
            u, u2, l = 0,
            vbData = self.vbData;
        var above = self.currentAbove,
            below = self.currentBelow;
        vbData[n] = s.start[0] + s.up[0] * above;
        vbData[n + 1] = s.start[1] + s.up[1] * above;
        vbData[n + 2] = s.start[2] + s.up[2] * above;
        vbData[n + 3] = 1;
        vbData[n + 4] = 0;
        n += 5;
        vbData[n] = s.start[0] - s.up[0] * below;
        vbData[n + 1] = s.start[1] - s.up[1] * below;
        vbData[n + 2] = s.start[2] - s.up[2] * below;
        vbData[n + 3] = 1;
        vbData[n + 4] = 1;
        n += 5;
        for (i = 0; i < self.numSegments; ++i) {
            s = self.segments[(self.currentSegment + i) % self.maxSegments];
            u = 1 - (self.currentLength != 0 ? l / self.currentLength : 0);
            u2 = 1 - (self.currentLength != 0 ? (l + s.length) / self.currentLength : 1);
            vbData[n] = s.position[0] + s.up[0] * above;
            vbData[n + 1] = s.position[1] + s.up[1] * above;
            vbData[n + 2] = s.position[2] + s.up[2] * above;
            vbData[n + 3] = u2;
            vbData[n + 4] = 0;
            n += 5;
            vbData[n] = s.position[0] - s.up[0] * below;
            vbData[n + 1] = s.position[1] - s.up[1] * below;
            vbData[n + 2] = s.position[2] - s.up[2] * below;
            vbData[n + 3] = u2;
            vbData[n + 4] = 1;
            n += 5;
            l += s.length
        }
        if (!self.vb) {
            self.vb = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
            gl.bufferData(gl.ARRAY_BUFFER, self.vbData, gl.DYNAMIC_DRAW)
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, self.vbData)
        }
    },
    draw: function() {
        var self = this,
            gl = self.model.renderer.context,
            i;
        if (self.numSegments == 0) return;
        if (!self.shaderReady) self.initShader();
        if (!self.program) return;
        if (!self.texture && self.textureIds[0] > -1 && self.textureIds[0] < self.model.materials.length) {
            var mat = self.model.materials[self.textureIds[0]];
            if (mat.texture && mat.texture.texture && (!mat.texture.alphaImg || mat.texture.alphaTexture)) {
                self.texture = mat.texture
            }
        }
        if (!self.texture) return;
        gl.useProgram(self.program);
        gl.uniformMatrix4fv(self.uniforms.vModelMatrix, false, self.model.matrix);
        gl.uniformMatrix4fv(self.uniforms.vViewMatrix, false, self.model.renderer.viewMatrix);
        gl.uniformMatrix4fv(self.uniforms.vProjMatrix, false, self.model.renderer.projMatrix);
        gl.uniform4fv(self.uniforms.fColor, self.currentColor);
        if (self.texture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, self.texture.texture);
            gl.uniform1i(self.uniforms.fTexture, 0)
        }
        if (self.texture && self.texture.alphaTexture) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, self.texture.alphaTexture);
            gl.uniform1i(self.uniforms.fAlpha, 1)
        }
        gl.uniform1i(self.uniforms.fHasTexture, self.texture ? 1 : 0);
        gl.uniform1i(self.uniforms.fHasAlpha, self.texture && self.texture.alphaTexture ? 1 : 0);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.disable(gl.CULL_FACE);
        gl.depthMask(false);
        gl.bindBuffer(gl.ARRAY_BUFFER, self.vb);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.ib);
        for (i in self.attribs) {
            var a = self.attribs[i];
            gl.enableVertexAttribArray(a.loc);
            gl.vertexAttribPointer(a.loc, a.size, a.type, false, a.stride, a.offset)
        }
        gl.drawElements(gl.TRIANGLES, self.numSegments * 6, gl.UNSIGNED_SHORT, 0);
        for (i in self.attribs) {
            gl.disableVertexAttribArray(self.attribs[i].loc)
        }
    },
    initShader: function() {
        var self = this,
            gl = self.model.renderer.context;
        self.shaderReady = true;
        var vs = self.model.renderer.compileShader(gl.VERTEX_SHADER, self.vertShader);
        var fs = self.model.renderer.compileShader(gl.FRAGMENT_SHADER, self.fragShader);
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Error linking shaders");
            return
        }
        self.vs = vs;
        self.fs = fs;
        self.program = program;
        self.uniforms = {
            vModelMatrix: gl.getUniformLocation(program, "uModelMatrix"),
            vViewMatrix: gl.getUniformLocation(program, "uViewMatrix"),
            vProjMatrix: gl.getUniformLocation(program, "uProjMatrix"),
            fHasTexture: gl.getUniformLocation(program, "uHasTexture"),
            fHasAlpha: gl.getUniformLocation(program, "uHasAlpha"),
            fTexture: gl.getUniformLocation(program, "uTexture"),
            fAlpha: gl.getUniformLocation(program, "uAlpha"),
            fColor: gl.getUniformLocation(program, "uColor")
        };
        self.attribs = {
            position: {
                loc: gl.getAttribLocation(program, "aPosition"),
                type: gl.FLOAT,
                size: 3,
                offset: 0,
                stride: 20
            },
            texcoord: {
                loc: gl.getAttribLocation(program, "aTexCoord"),
                type: gl.FLOAT,
                size: 2,
                offset: 12,
                stride: 20
            }
        }
    },
    vertShader: "        attribute vec3 aPosition;        attribute vec2 aTexCoord;                varying vec2 vTexCoord;                uniform mat4 uModelMatrix;        uniform mat4 uViewMatrix;        uniform mat4 uProjMatrix;                void main(void) {            gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1);                        vTexCoord = aTexCoord;        }    ",
    fragShader: "        precision mediump float;                varying vec2 vTexCoord;                uniform bool uHasTexture;        uniform bool uHasAlpha;        uniform sampler2D uTexture;        uniform sampler2D uAlpha;        uniform vec4 uColor;                void main(void) {            vec4 color = vec4(1, 1, 1, 1);            if (uHasTexture) {                color = texture2D(uTexture, vTexCoord.st);            }            if (uHasAlpha) {                color.a = texture2D(uAlpha, vTexCoord.st).r;            }                        gl_FragColor = color * uColor;        }    ",
    update: function(anim, time) {
        var self = this,
            Wow = ZamModelViewer.Wow,
            i, s;
        vec3.transformMat4(self.tmpPosition, self.position, self.bone.matrix);
        vec4.set(self.tmpUp, 0, 0, 1, 0);
        vec4.transformMat4(self.tmpUp, self.tmpUp, self.bone.matrix);
        vec3.normalize(self.tmpUp, self.tmpUp);
        if (self.numSegments == 0) {
            s = self.pushSegment();
            vec3.copy(s.start, self.tmpPosition);
            vec3.copy(s.position, self.tmpPosition);
            vec4.copy(s.up, self.tmpUp);
            s.length = 0
        } else {
            var currIdx = (self.currentSegment + self.numSegments - 1) % self.maxSegments;
            s = self.segments[currIdx];
            vec3.copy(s.position, self.tmpPosition);
            vec4.copy(s.up, self.tmpUp);
            vec3.subtract(self.tmpVec, s.position, self.currentPosition);
            s.length += vec3.length(self.tmpVec);
            if (s.length >= self.length) {
                s = self.pushSegment();
                vec3.copy(s.start, self.tmpPosition);
                vec3.copy(s.position, self.tmpPosition);
                vec4.copy(s.up, self.tmpUp);
                s.length = 0
            }
        }
        self.currentLength = 0;
        var idx;
        for (i = 0; i < self.numSegments; ++i) {
            idx = (self.currentSegment + i) % self.maxSegments;
            self.currentLength += self.segments[idx].length
        }
        if (self.currentLength > self.totalLength + .1) {
            self.currentLength -= self.segments[self.currentSegment].length;
            self.shiftSegment()
        }
        vec3.copy(self.currentPosition, self.tmpPosition);
        Wow.AnimatedVec3.getValue(self.color, anim, time, self.currentColor);
        self.currentColor[3] = Wow.AnimatedUint16.getValue(self.alpha, anim, time) / 32767;
        self.currentAbove = Wow.AnimatedFloat.getValue(self.above, anim, time);
        self.currentBelow = Wow.AnimatedFloat.getValue(self.below, anim, time);
        self.updateBuffers()
    },
    pushSegment: function() {
        var self = this;
        if (self.numSegments < self.maxSegments) {
            self.numSegments++
        } else {
            self.currentSegment = (self.currentSegment + 1) % self.maxSegments
        }
        return self.segments[self.currentSegment]
    },
    popSegment: function() {
        var self = this;
        self.numSegments--
    },
    shiftSegment: function() {
        var self = this;
        self.currentSegment = (self.currentSegment + 1) % self.maxSegments;
        self.numSegments--
    }
};
ZamModelViewer.Wow.Skin = function(r, version) {
    var self = this;
    self.skinFlags = version > 2e3 ? r.getUint32() : 0;
    self.base = r.getString();
    self.fur = r.getString();
    self.underwearFlags = version > 2e3 ? r.getUint32() : 0;
    self.panties = r.getString();
    self.bra = r.getString();
    self.faces = null
};
ZamModelViewer.Wow.Skin._lastFaces = null;
ZamModelViewer.Wow.Skin.GetSkins = function(skins, playerOnly, dk) {
    if (!skins) return [];
    var list = [];
    for (var i = 0; i < skins.length; ++i) {
        if (playerOnly && (skins[i].skinFlags & 3) > 0) {
            if ((skins[i].skinFlags & 4) > 0) {
                if (dk) list.push(skins[i])
            } else {
                list.push(skins[i])
            }
        } else if (!playerOnly || skins[i].skinFlags == 0) {
            list.push(skins[i])
        }
    }
    return list
};
ZamModelViewer.Wow.Skin.GetFaces = function(faces, playerOnly, dk, skinFlags) {
    if (!faces || dk && (skinFlags & 4) > 0) return [];
    var list = [];
    for (var i = 0; i < faces.length; ++i) {
        if (playerOnly && (faces[i].flags & 3) > 0) {
            if ((faces[i].flags & 4) > 0) {
                if (dk) list.push(faces[i])
            } else {
                list.push(faces[i])
            }
        } else if (!playerOnly || faces[i].flags == 0) {
            list.push(faces[i])
        }
    }
    return list
};
ZamModelViewer.Wow.Skin.prototype = {
    destroy: function() {
        var self = this;
        if (self.faces) {
            for (var i = 0; i < self.faces.length; ++i) self.faces[i] = null;
            self.faces = null
        }
    },
    readFaces: function(r, version) {
        var self = this;
        var count = r.getInt32();
        if (count == 0 && ZamModelViewer.Wow.Skin._lastFaces) {
            self.faces = ZamModelViewer.Wow.Skin._lastFaces
        } else if (count > 0) {
            self.faces = new Array(count);
            for (var i = 0; i < count; ++i) {
                self.faces[i] = {
                    flags: version > 2e3 ? r.getUint32() : 0,
                    lower: r.getString(),
                    upper: r.getString()
                };
                ZamModelViewer.Wow.Skin._lastFaces = self.faces[i]
            }
        }
    }
};
ZamModelViewer.Wow.Face = function(r) {
    var self = this;
    self.geoset1 = r.getInt32();
    self.geoset2 = r.getInt32();
    self.geoset3 = r.getInt32();
    self.textures = null
};
ZamModelViewer.Wow.Face.GetTextures = function(textures, playerOnly, dk) {
    if (!textures) return [];
    var list = [];
    for (var i = 0; i < textures.length; ++i) {
        if (playerOnly && (textures[i].flags & 3) > 0) {
            if ((textures[i].flags & 4) > 0) {
                if (dk) list.push(textures[i])
            } else {
                list.push(textures[i])
            }
        } else if (!playerOnly || textures[i].flags == 0) {
            list.push(textures[i])
        }
    }
    return list
};
ZamModelViewer.Wow.Face.prototype = {
    destroy: function() {
        var self = this;
        if (self.textures) {
            for (var i = 0; i < self.textures.length; ++i) self.textures[i] = null;
            self.textures = null
        }
    },
    readTextures: function(r, version) {
        var self = this;
        var count = r.getInt32();
        if (count > 0) {
            self.textures = new Array(count);
            for (var i = 0; i < count; ++i) {
                self.textures[i] = {
                    flags: version > 2e3 ? r.getUint32() : 0,
                    lower: r.getString(),
                    upper: r.getString()
                }
            }
        }
    }
};
ZamModelViewer.Wow.Hair = function(r) {
    var self = this;
    self.geoset = r.getInt32();
    self.index = r.getInt32();
    self.textures = null
};
ZamModelViewer.Wow.Hair.GetTextures = function(textures, playerOnly, dk) {
    if (!textures) return [];
    var list = [];
    for (var i = 0; i < textures.length; ++i) {
        if (playerOnly && (textures[i].flags & 3) > 0) {
            if ((textures[i].flags & 4) > 0) {
                if (dk) list.push(textures[i])
            } else {
                list.push(textures[i])
            }
        } else if (!playerOnly || textures[i].flags == 0) {
            list.push(textures[i])
        }
    }
    return list
};
ZamModelViewer.Wow.Hair.prototype = {
    destroy: function() {
        var self = this;
        if (self.textures) {
            for (var i = 0; i < self.textures.length; ++i) self.textures[i] = null;
            self.textures = null
        }
    },
    readTextures: function(r, version) {
        var self = this;
        var count = r.getInt32();
        if (count > 0) {
            self.textures = new Array(count);
            for (var i = 0; i < count; ++i) {
                self.textures[i] = {
                    flags: version > 2e3 ? r.getUint32() : 0,
                    texture: r.getString(),
                    lower: r.getString(),
                    upper: r.getString()
                }
            }
        }
    }
};