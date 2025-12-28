import React, { useState, useEffect, useRef, useMemo } from 'react';

import { Settings, Activity, Maximize2, Info, Zap, Lightbulb, Ruler, ChevronRight } from 'lucide-react';



const App = () => {

  const [activeTab, setActiveTab] = useState('spatial'); // 默认展示空间相干性（用户关注点）

  const [viewMode, setViewMode] = useState('intensity');

 

  // 物理参数

  const [wavelength, setWavelength] = useState(550);

  const [bandwidth, setBandwidth] = useState(20);

  const [pathDiff, setPathDiff] = useState(0);

  const [sourceSize, setSourceSize] = useState(0.2);

  const [slitDistance, setSlitDistance] = useState(0.8);

  const [zDistance, setZDistance] = useState(1000);



  const canvasRef = useRef(null);



  // 波长转RGB

  const wlToRgb = (wl) => {

    let r, g, b;

    if (wl >= 380 && wl < 440) { r = -(wl - 440) / (440 - 380); g = 0; b = 1; }

    else if (wl >= 440 && wl < 490) { r = 0; g = (wl - 440) / (490 - 440); b = 1; }

    else if (wl >= 490 && wl < 510) { r = 0; g = 1; b = -(wl - 510) / (510 - 490); }

    else if (wl >= 510 && wl < 580) { r = (wl - 510) / (580 - 510); g = 1; b = 0; }

    else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / (645 - 580); b = 0; }

    else if (wl >= 645 && wl <= 780) { r = 1; g = 0; b = 0; }

    else { r = 0; g = 0; b = 0; }

    return [r * 255, g * 255, b * 255];

  };



  const baseColor = useMemo(() => wlToRgb(wavelength), [wavelength]);



  // 计算当前的可见度 (Visibility)

  const calculateVisibility = () => {

    if (activeTab === 'temporal') {

      const Lc = (wavelength * wavelength) / (bandwidth || 0.1) / 1000;

      return Math.exp(-Math.pow(pathDiff / (Lc * 0.5), 2));

    } else {

      const arg = (Math.PI * sourceSize * slitDistance) / ((wavelength / 1e6) * zDistance);

      return Math.abs(Math.sin(arg + 1e-9) / (arg + 1e-9));

    }

  };



  const visibility = calculateVisibility();



  // 渲染画布

  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const { width, height } = canvas;

    const imageData = ctx.createImageData(width, height);

    const data = imageData.data;



    const wl_mm = wavelength / 1e6;

    const fringeSpacing = activeTab === 'temporal' ? 5 : (wl_mm * zDistance) / slitDistance * 20;



    for (let x = 0; x < width; x++) {

      const phase = (x - width / 2) / fringeSpacing * (2 * Math.PI) + (activeTab === 'temporal' ? pathDiff * 0.5 : 0);

      const intensity = 0.5 * (1 + visibility * Math.cos(phase));

     

      for (let y = 0; y < height; y++) {

        const idx = (y * width + x) * 4;

        data[idx] = baseColor[0] * intensity;

        data[idx + 1] = baseColor[1] * intensity;

        data[idx + 2] = baseColor[2] * intensity;

        data[idx + 3] = 255;

      }

    }

    ctx.putImageData(imageData, 0, 0);

  }, [activeTab, wavelength, bandwidth, pathDiff, sourceSize, slitDistance, zDistance, baseColor, visibility]);



  return (

    <div className="flex flex-col h-screen bg-gray-50 text-slate-900 font-sans overflow-hidden">

      {/* 顶部导航 */}

      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">

        <div className="flex items-center gap-3">

          <div className="bg-blue-600 p-2 rounded-lg">

            <Zap className="text-white" size={24} />

          </div>

          <h1 className="text-xl font-bold text-slate-800 italic">物理教学实验室：光波相干性</h1>

        </div>

        <div className="flex gap-2 bg-gray-100 p-1 rounded-full">

          {[['spatial', '空间相干性 (杨氏双缝)'], ['temporal', '时间相干性 (迈克耳孙)']].map(([key, label]) => (

            <button

              key={key}

              onClick={() => setActiveTab(key)}

              className={`px-6 py-2 rounded-full text-sm font-bold transition ${activeTab === key ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}

            >

              {label}

            </button>

          ))}

        </div>

      </nav>



      <main className="flex-1 flex overflow-hidden">

        {/* 左侧控制区 */}

        <aside className="w-96 bg-white border-r p-8 overflow-y-auto space-y-8">

          <section>

            <h2 className="flex items-center gap-2 text-blue-600 font-bold mb-6">

              <Settings size={18} /> 参数调节

            </h2>

           

            <div className="space-y-8">

              {/* 波长选择 */}

              <div className="space-y-3">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-600 font-medium">光的波长 (λ)</span>

                  <span className="font-mono text-blue-600 font-bold">{wavelength} nm</span>

                </div>

                <input

                  type="range" min="380" max="780" value={wavelength}

                  onChange={(e) => setWavelength(Number(e.target.value))}

                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"

                />

                <div className="flex justify-between text-[10px] text-gray-400">

                  <span>紫外区</span><span>可见光谱</span><span>红外区</span>

                </div>

              </div>



              {activeTab === 'spatial' ? (

                <>

                  <div className="space-y-3">

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-600 font-medium">光源宽度 (w)</span>

                      <span className="font-mono text-emerald-600 font-bold">{sourceSize} mm</span>

                    </div>

                    <input

                      type="range" min="0.01" max="1.5" step="0.01" value={sourceSize}

                      onChange={(e) => setSourceSize(Number(e.target.value))}

                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"

                    />

                    <p className="text-[11px] text-gray-400 italic">光源越宽，不同位置发射的光叠加后干涉越模糊。</p>

                  </div>

                  <div className="space-y-3">

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-600 font-medium">双缝间距 (d)</span>

                      <span className="font-mono text-emerald-600 font-bold">{slitDistance} mm</span>

                    </div>

                    <input

                      type="range" min="0.2" max="2.0" step="0.1" value={slitDistance}

                      onChange={(e) => setSlitDistance(Number(e.target.value))}

                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"

                    />

                  </div>

                </>

              ) : (

                <>

                  <div className="space-y-3">

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-600 font-medium">光谱带宽 (Δλ)</span>

                      <span className="font-mono text-purple-600 font-bold">{bandwidth} nm</span>

                    </div>

                    <input

                      type="range" min="1" max="100" step="1" value={bandwidth}

                      onChange={(e) => setBandwidth(Number(e.target.value))}

                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"

                    />

                  </div>

                  <div className="space-y-3">

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-600 font-medium">光程差 (ΔL)</span>

                      <span className="font-mono text-purple-600 font-bold">{pathDiff} μm</span>

                    </div>

                    <input

                      type="range" min="-40" max="40" step="0.5" value={pathDiff}

                      onChange={(e) => setPathDiff(Number(e.target.value))}

                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"

                    />

                  </div>

                </>

              )}

            </div>

          </section>



          {/* 直观公式解析板 */}

          <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">

            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 flex items-center gap-2">

              <Lightbulb size={14} /> 原理解析

            </h3>

            <div className="space-y-4">

              <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center">

                <span className="text-[10px] text-gray-400 mb-2 uppercase">当前公式 (可见度模型)</span>

                {activeTab === 'spatial' ? (

                  <svg viewBox="0 0 200 60" className="w-full h-12">

                    <text x="10" y="35" className="text-[14px] fill-slate-800 font-serif">V = | sinc (</text>

                    <text x="85" y="25" className="text-[10px] fill-emerald-600 font-serif">π · w · d</text>

                    <line x1="82" y1="30" x2="135" y2="30" stroke="#94a3b8" strokeWidth="1" />

                    <text x="95" y="45" className="text-[10px] fill-blue-600 font-serif">λ · D</text>

                    <text x="140" y="35" className="text-[14px] fill-slate-800 font-serif">) |</text>

                  </svg>

                ) : (

                  <svg viewBox="0 0 200 60" className="w-full h-12">

                    <text x="20" y="35" className="text-[14px] fill-slate-800 font-serif">V = exp [ -(</text>

                    <text x="95" y="25" className="text-[10px] fill-purple-600 font-serif">ΔL</text>

                    <line x1="90" y1="30" x2="115" y2="30" stroke="#94a3b8" strokeWidth="1" />

                    <text x="95" y="45" className="text-[10px] fill-gray-500 font-serif">Lc</text>

                    <text x="120" y="35" className="text-[14px] fill-slate-800 font-serif">)² ]</text>

                  </svg>

                )}

              </div>

              <ul className="text-[11px] space-y-2 text-slate-600">

                <li className="flex gap-2">

                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0" />

                  <span><b>V (可见度)：</b>数值越接近 1，条纹越清晰。</span>

                </li>

                <li className="flex gap-2">

                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />

                  <span><b>w & d：</b>分子项增加时，相干性下降。</span>

                </li>

              </ul>

            </div>

          </section>

        </aside>



        {/* 右侧展示区 */}

        <div className="flex-1 bg-gray-100 p-8 flex flex-col gap-6 overflow-hidden">

          {/* 主仿真视窗 */}

          <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col relative">

            <div className="absolute top-4 left-6 z-10 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full border shadow-sm flex items-center gap-2">

              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">

                实时干涉模拟图样

              </span>

            </div>

           

            <div className="flex-1 flex items-center justify-center p-12 bg-black">

              <canvas ref={canvasRef} width={800} height={300} className="w-full max-w-4xl h-auto shadow-2xl rounded-sm" />

            </div>



            {/* 实时波形分析图 */}

            <div className="h-40 bg-gray-50 border-t flex items-end px-12 pb-4 gap-1 relative">

              <div className="absolute top-2 left-12 text-[9px] font-bold text-gray-400 uppercase">

                截面强度分布曲线 (Intensity Profile)

              </div>

              {Array.from({ length: 100 }).map((_, i) => {

                const phase = (i - 50) / 5 * (2 * Math.PI);

                const intensity = 0.5 * (1 + visibility * Math.cos(phase));

                return (

                  <div

                    key={i}

                    className="flex-1 bg-blue-600/20 border-t-2 border-blue-500"

                    style={{ height: `${intensity * 80}%`, transition: 'height 0.1s ease-out' }}

                  />

                );

              })}

            </div>

          </div>



          {/* 结论卡片 */}

          <div className="h-32 grid grid-cols-3 gap-6">

            <div className="bg-white rounded-2xl border p-6 flex flex-col justify-center">

              <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">对比度 (V)</span>

              <div className="flex items-baseline gap-2">

                <span className="text-4xl font-mono font-bold text-slate-800">

                  {(visibility * 100).toFixed(1)}

                </span>

                <span className="text-xl text-gray-400 font-light">%</span>

              </div>

              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">

                <div

                  className="h-full bg-blue-500 transition-all duration-300"

                  style={{ width: `${visibility * 100}%` }}

                />

              </div>

            </div>



            <div className="col-span-2 bg-blue-600 rounded-2xl p-6 text-white flex items-center gap-6 shadow-lg shadow-blue-200">

              <div className="bg-white/20 p-3 rounded-xl backdrop-blur">

                <Info size={32} />

              </div>

              <div>

                <h4 className="font-bold text-lg mb-1">实验结论</h4>

                <p className="text-blue-100 text-xs leading-relaxed max-w-lg">

                  {activeTab === 'spatial'

                    ? `当前光源宽度为 ${sourceSize}mm。随着光源变宽，不同点光源产生的条纹发生位移并相互填补暗区，导致对比度下降。当 V 降至 0 时，相干性完全丧失。`

                    : `当前光谱带宽为 ${bandwidth}nm。光谱越宽，不同频率光的干涉条纹重合度越差。随着光程差增加，条纹将迅速变模糊。`

                  }

                </p>

              </div>

            </div>

          </div>

        </div>

      </main>



      <style>{`

        input[type=range]::-webkit-slider-thumb {

          -webkit-appearance: none;

          height: 18px;

          width: 18px;

          border-radius: 50%;

          background: white;

          border: 3px solid currentColor;

          cursor: pointer;

          box-shadow: 0 2px 5px rgba(0,0,0,0.1);

        }

      `}</style>

    </div>

  );

};



export default App;
