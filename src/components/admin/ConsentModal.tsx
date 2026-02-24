import { Reservation } from '@prisma/client';
import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ConsentModalProps {
    reservation: Reservation;
    onClose: () => void;
}

export default function ConsentModal({ reservation, onClose }: ConsentModalProps) {
    const printRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSavePdf = async () => {
        if (!printRef.current) return;
        setIsSaving(true);

        try {
            // Tailwind v4에서 oklch 등 최신 CSS 컬러 문법을 사용할 경우 html2canvas 내부 파서가 에러를 뿜을 수 있습니다.
            // onclone 옵션을 통해 캡처 직전 임시 생성된 document의 스타일을 RGB로 강제 변환하거나 에러를 무시하도록 우회합니다.
            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: printRef.current.scrollWidth,
                windowHeight: printRef.current.scrollHeight,
                onclone: (clonedDoc) => {
                    const elements = clonedDoc.querySelectorAll('*');
                    elements.forEach((el) => {
                        const style = window.getComputedStyle(el);
                        // 특정 프로퍼티에 oklch/oklab 등이 있으면 무조건 흰색/검은색/투명으로 덮어버림(가장 흔한 테두리, 배경, 글자색 위주)
                        if (style.color.includes('oklch') || style.color.includes('oklab') || style.color.includes('lch')) {
                            (el as HTMLElement).style.color = '#000000';
                        }
                        if (style.backgroundColor.includes('oklch') || style.backgroundColor.includes('oklab') || style.backgroundColor.includes('lch')) {
                            (el as HTMLElement).style.backgroundColor = 'transparent';
                        }
                        if (style.borderColor.includes('oklch') || style.borderColor.includes('oklab') || style.borderColor.includes('lch')) {
                            (el as HTMLElement).style.borderColor = '#cccccc';
                        }
                    });
                }
            });

            const imgData = canvas.toDataURL('image/png');

            // A4 용지 비율에 맞춰서 PDF 생성 (세로 방향)
            // jsPDF 인스턴스화 방식 명확화
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`시술동의서_${reservation.name}_${reservation.reservationDate}.pdf`);
        } catch (error: any) {
            console.error("PDF 생성 에러:", error);
            // 에러의 상세 내용을 출력하도록 변경합니다
            alert(`PDF 생성 중 오류가 발생했습니다.\n상세: ${error?.message || error}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4 print:bg-white print:p-0 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white text-black w-full max-w-4xl my-auto max-h-[90vh] overflow-y-auto p-4 md:p-6 rounded-xl shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 버튼 */}
                <div className="flex justify-end gap-2 mb-4 sticky top-0 bg-white/90 pb-2 border-b z-50">
                    <button
                        onClick={handleSavePdf}
                        disabled={isSaving}
                        className={`px-5 py-2 ${isSaving ? 'bg-neutral-500' : 'bg-neutral-800 hover:bg-neutral-700'} text-white font-bold rounded transition`}
                    >
                        {isSaving ? '저장 중...' : 'PDF 저장하기'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-neutral-200 text-black font-bold rounded hover:bg-neutral-300 transition"
                    >
                        닫기
                    </button>
                </div>

                {/* 동의서 내용 시작 (이 영역만 캡처됨) */}
                <div ref={printRef} className="font-sans text-[11px] md:text-[12px] leading-5 space-y-4 bg-white p-4 md:p-6 text-gray-900 mx-auto max-w-4xl">
                    <div className="text-center pb-3 border-b-2 border-gray-900 mb-4">
                        <h1 className="text-xl md:text-2xl font-extrabold tracking-widest">시술 동의서</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 왼쪽 1번 통 */}
                        <section>
                            <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">1. 고객 인적사항</h2>
                            <div className="flex flex-col gap-2 px-2">
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="w-24 font-semibold shrink-0">· 성명</span>
                                    <span className="truncate">{reservation.name}</span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="w-24 font-semibold shrink-0">· 생년월일</span>
                                    <span></span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="w-24 font-semibold shrink-0">· 연락처</span>
                                    <span className="truncate">{reservation.phone}</span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="w-24 font-semibold shrink-0">· 주소</span>
                                    <span></span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="w-32 font-semibold text-gray-700 shrink-0">· 신분증 확인 여부</span>
                                    <span className="font-bold flex items-center gap-2">
                                        <input type="checkbox" className="w-4 h-4" /> 확인 완료
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* 오른쪽 2번 통 */}
                        <section>
                            <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">2. 시술 정보</h2>
                            <div className="flex flex-col gap-2 px-2">
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="w-24 font-semibold shrink-0">· 시술 부위</span>
                                    <span className="truncate">{reservation.part} ({reservation.genre})</span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="w-24 font-semibold shrink-0">· 색상 여부</span>
                                    <span>(흑백 / 컬러)</span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2 w-full">
                                    <span className="w-24 font-semibold shrink-0">· 시술 일자</span>
                                    <span className="truncate block flex-1">{reservation.reservationDate} {reservation.reservationTime}</span>
                                </div>
                                <div className="flex border-b border-gray-200 pb-2">
                                    <span className="w-24 font-semibold shrink-0">· 시술자 성명</span>
                                    <span></span>
                                </div>
                            </div>
                            {reservation.referenceText && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm leading-relaxed text-[11px] h-full">
                                    <span className="font-bold block mb-1 text-gray-800">· 참고 및 요청사항: </span>
                                    <p className="whitespace-pre-wrap text-gray-700">{reservation.referenceText}</p>
                                </div>
                            )}
                        </section>
                    </div>

                    <section>
                        <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">3. 건강 상태 확인 <span className="text-[11px] font-normal text-gray-500">(해당 여부 체크)</span></h2>
                        <div className="grid grid-cols-6 gap-y-3 gap-x-2 mb-3 px-2 text-[11px]">
                            {/* 첫 번째 줄: 6개 칸을 1개씩 차지 */}
                            <label className="flex items-center gap-1.5 whitespace-nowrap"><input type="checkbox" className="w-3.5 h-3.5" /> 당뇨병</label>
                            <label className="flex items-center gap-1.5 whitespace-nowrap"><input type="checkbox" className="w-3.5 h-3.5" /> 심장질환</label>
                            <label className="flex items-center gap-1.5 whitespace-nowrap"><input type="checkbox" className="w-3.5 h-3.5" /> 고혈압</label>
                            <label className="flex items-center gap-1.5 whitespace-nowrap"><input type="checkbox" className="w-3.5 h-3.5" /> 혈액응고 장애</label>
                            <label className="flex items-center gap-1.5 whitespace-nowrap"><input type="checkbox" className="w-3.5 h-3.5" /> 간염(HBV/HCV)</label>
                            <label className="flex items-center gap-1.5 whitespace-nowrap"><input type="checkbox" className="w-3.5 h-3.5" /> HIV/AIDS</label>

                            {/* 두 번째 줄: 5개 항목, 왼쪽부터 배치하여 위와 열을 맞춤 */}
                            <label className="flex items-center gap-1.5 whitespace-nowrap"><input type="checkbox" className="w-3.5 h-3.5" /> 피부질환(아토피 등)</label>
                            <label className="flex items-center gap-1.5 whitespace-nowrap"><input type="checkbox" className="w-3.5 h-3.5" /> 금속 알레르기</label>
                            <label className="flex items-center gap-1.5 whitespace-nowrap"><input type="checkbox" className="w-3.5 h-3.5" /> 잉크 알레르기 경험</label>
                            <label className="flex items-center gap-1.5 whitespace-nowrap"><input type="checkbox" className="w-3.5 h-3.5" /> 약물 복용(항응고제 등)</label>
                            <label className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer col-span-2 md:col-span-1"><input type="checkbox" className="w-4 h-4" /> 임신/수유 중</label>
                        </div>
                        <p className="font-bold text-red-600 mt-2 px-2 bg-red-50 py-1.5 rounded text-[11px] w-fit">→ 허위 및 누락 작성 시 발생하는 모든 책임은 본인에게 있습니다.</p>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">4. 감염 및 부작용 고지</h2>
                        <ul className="space-y-4 list-none px-2">
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">①</span> <span>본인은 시술 후 3~7일간 다음과 같은 반응이 일반적으로 나타날 수 있음을 충분히 설명 듣고 이해합니다.<br /><span className="text-gray-600 mt-1 block pl-6">· 미세한 출혈 또는 진물<br />· 붓기 및 열감<br />· 가려움<br />· 각질 형성 및 탈락<br />· 일시적 색상 진함 또는 흐림 현상</span></span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">②</span> <span>위와 같은 반응은 피부 재생 과정에서 발생하는 <strong className="text-black">자연스러운 현상</strong>임을 이해하며, 이를 이유로 환불 또는 책임을 요구하지 않습니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">③</span> <span><strong className="text-black">다음과 같은 증상이 발생할 경우 즉시 의료기관을 방문</strong>해야 함을 안내받았습니다.<br /><span className="text-gray-600 mt-1 block pl-6">· 38도 이상의 고열 또는 오한<br />· 5일 이상 지속되는 심한 부종 및 통증<br />· 고름/악취 동반 분비물<br />· 시술 부위에서 붉은 선이 주변으로 퍼지는 증상<br />· 광범위한 알레르기 반응(두드러기, 호흡곤란 등)</span></span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">④</span> <span>위와 같은 이상 증상 발생 시 지체 없이 스튜디오에 통보해야 함을 인지합니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">⑤</span> <span><strong className="text-black">2차 감염</strong>은 개인 위생 관리 소홀, 음주, 사우나·수영·과도한 운동, 연고 미사용, 시술 부위 접촉 등 사후관리 지침 미이행으로 발생할 수 있으며, 이로 인한 문제는 고객 본인의 책임임을 이해합니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">⑥</span> <span>개인 체질, 면역 상태, 기저질환에 따라 회복 경과는 달라질 수 있음을 인정합니다.</span></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">5. 의료행위 아님 고지</h2>
                        <ul className="space-y-4 list-none px-2">
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">①</span> <span>본 시술은 미용 목적의 색소 시술로서 <strong className="text-black">의료법상 의료행위에 해당하지 않습니다.</strong></span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">②</span> <span>본 시술은 질병의 예방·진단·치료를 목적으로 하지 않으며, 어떠한 의학적 효능이나 치료 효과도 보장하지 않습니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">③</span> <span>본 시술은 의료적 처치를 대체하지 않으며, 피부 질환·염증·알레르기·체질적 문제 등에 대한 치료 행위가 아닙니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">④</span> <span>시술 후 이상 증상이 발생할 경우 즉시 의료기관을 방문해야 함을 안내받았습니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">⑤</span> <span>시술 이후 발생하는 <strong className="text-black">의료적 처치 비용은 고객 본인의 부담</strong>이며, 개인 체질·기저질환·사후관리 미이행으로 인한 문제에 대해 스튜디오는 책임을 지지 않습니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">⑥</span> <span>본인은 위 내용을 충분히 설명 듣고 이해하였으며, <strong className="text-black">자발적으로 시술을 선택합니다.</strong></span></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">6. 디자인 및 결과 책임 범위</h2>
                        <ul className="space-y-4 list-none px-2">
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">①</span> <span>본인은 피부 톤, 두께, 재생 속도, 면역 상태 등에 따라 발색·채도·명도는 <strong className="text-black">개인차가 발생함</strong>을 이해합니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">②</span> <span>동일 도안이라 하더라도 부위, 마찰 정도 등에 따라 번짐, 흐림, 굵기 변화가 발생할 수 있음을 인지합니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">③</span> <span>특히 다음 특정 부위는 <strong className="text-black">색소 유지력이 낮거나 탈락 가능성이 높으며</strong> 반복적 보정이 필요할 수 있음을 안내받았습니다.<br /><span className="text-gray-600 mt-1 block pl-6">· 손가락, 손등, 발등, 옆구리<br />· 관절 부위 (팔꿈치, 무릎 등)</span></span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">④</span> <span>시술 직후 색상은 실제 정착 색상보다 진하게 표현될 수 있으며, 회복 과정에서 약 10~30% 밝아질 수 있음을 인지합니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">⑤</span> <span>시술 결과는 피부 특성에 따라 차이가 발생할 수 있으며, 이를 이유로 환불을 요구하지 않습니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">⑥</span> <span>리터치는 <strong className="text-black">최초 시술일 기준 ___일 이내 1회</strong> 한하여 제공되며, 이후 혹은 고객 귀책 사유로 인한 보정과 디자인 변경은 <strong className="text-black">유상</strong>입니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">⑦</span> <span>완벽한 대칭, 완전 동일 색감, 100% 사진과 동일한 결과는 보장되지 않음을 이해합니다.</span></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">7. 사후관리 안내 및 책임 고지</h2>
                        <ul className="space-y-4 list-none px-2">
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">①</span> <span>본인은 시술 후 관리 방법에 대해 충분한 설명을 듣고 안내서를 수령하였음을 확인합니다. <br /> <label className="inline-flex items-center gap-2 mt-2 font-bold bg-yellow-50 px-3 py-2 rounded-lg cursor-pointer"><input type="checkbox" className="w-5 h-5 cursor-pointer" /> 사후관리 안내서 수령 확인</label></span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">②</span> <span><strong className="text-black">[연고]</strong> 시술 부위는 지정된 연고를 1일 ___회, ___일간 도포하며 임의 사용 시 스튜디오는 책임지지 않습니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">③</span> <span><strong className="text-black">[세척]</strong> 시술 후 ___시간 이후 미온수로 부드럽게 세척하며 강한 마찰은 금지됩니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">④</span> <span><strong className="text-black">[주의]</strong> 음주( ___일), 사우나( ___주), 수영장( ___주), 격렬한 운동( ___일), 직사광선( ___주) 노출을 철저히 금합니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">⑤</span> <span><strong className="text-black">[터치]</strong> 긁기, 문지르기, 강제 각질 제거, 오염 노출 등을 자제해야 합니다.</span></li>
                            <li className="flex gap-2 text-red-600"><span className="font-bold min-w-[20px]">⑥</span> <strong className="font-bold">지침 미이행으로 발생한 부작용은 고객 책임이며, 외부 병원 치료 시에도 스튜디오는 책임을 지지 않습니다.</strong></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">8. 촬영 및 홍보 사용 동의 (선택 동의)</h2>
                        <div className="flex flex-col gap-3 font-bold px-2">
                            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-5 h-5 cursor-pointer" /> 시술 부위 사진 촬영 동의</label>
                            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-5 h-5 cursor-pointer" /> SNS 및 마케팅 활용 동의</label>
                            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-5 h-5 cursor-pointer" /> 얼굴 포함 촬영 허용 동의 여부</label>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">9. 환불 및 예약 규정</h2>
                        <ul className="space-y-4 list-none px-2">
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">①</span> <span>예약금은 <strong className="text-black">디자인 작업 착수 등에 따른 비용</strong>으로 어떠한 경우에도 환불되지 않습니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">②</span> <span>일정 변경은 ___일 전까지 1회 가능, 당일 취소/노쇼 시 재예약 제한 및 예약금 소멸. 지각 ___분 이상 시 시술 자동 취소.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">③</span> <span>도안 작업이 시작된 시점부터 환불 불가하며 시술 중단 역시 환불 사유가 되지 않습니다.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">④</span> <span><strong className="text-black">단순 변심, 디자인 변경, 통증 불만, 개인 사정 등은 환불 사유가 되지 않습니다.</strong></span></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">10. 면책 및 자발적 동의 조항</h2>
                        <p className="leading-relaxed px-2 text-justify">
                            본인은 충분한 설명을 듣고 자발적으로 시술에 동의하며, 궁금한 사항을 모두 확인했습니다. 강요 없이 스스로 판단하였으며, 정상적인 의사결정 상태에서 서명합니다. <strong className="text-black">법적 분쟁 발생 시 본 동의서가 유효한 증빙 자료임에 동의합니다.</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-bold mb-2 bg-gray-100 p-2 rounded-md border-l-2 border-gray-600">11. 개인정보 수집·이용 동의</h2>
                        <ul className="space-y-3 list-none px-2 mb-4">
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">①</span> <span><strong>목적 :</strong> 예약 관리, 시술 기록 보관, 사후관리 및 분쟁 증빙 용도</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">②</span> <span><strong>보관 :</strong> 시술일로부터 ___년간 보관 후 즉시 파기.</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[20px]">③</span> <span>제3자 제공을 원칙적으로 하지 않으며, 필수 항목 미동의 시 시술이 제한될 수 있습니다.</span></li>
                        </ul>
                        <div className="px-2">
                            <label className="inline-flex items-center gap-3 font-bold bg-blue-50 text-blue-900 border border-blue-200 px-4 py-3 rounded-lg cursor-pointer w-fit">
                                <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                                개인정보 수집·이용 내용에 동의합니다.
                            </label>
                        </div>
                    </section>

                    <section className="mt-8 pt-4 border-t-2 border-gray-900">
                        <h2 className="text-[14px] font-bold mb-4 text-center">12. 동의 및 서명란</h2>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-2xl mx-auto">
                            <div className="w-full text-center">
                                <div className="flex border-b border-dashed border-gray-400 pb-1 justify-center text-[12px]">
                                    <span className="font-bold">202 <span className="text-white">_</span> 년 <span className="text-white">__</span> 월 <span className="text-white">__</span> 일</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 mt-6 max-w-2xl mx-auto">
                            <div className="flex-1 flex flex-col gap-2">
                                <span className="font-bold text-[13px]">고객 서명 :</span>
                                <div className="border-b border-black h-8 flex items-end justify-center pb-1">
                                    <span className="font-bold italic text-gray-300 text-[14px] tracking-widest">(Sign)</span>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <span className="font-bold text-[13px]">시술자 서명 :</span>
                                <div className="border-b border-black h-8 flex items-end justify-center pb-1">
                                    <span className="font-bold italic text-gray-300 text-[14px] tracking-widest">(Sign)</span>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
