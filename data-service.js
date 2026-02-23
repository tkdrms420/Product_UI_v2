/**
 * ============================================
 * Data Service Module
 * ============================================
 * 역할: 데이터 처리 (백엔드 역할)
 * 책임: 서버/파일에서 데이터를 가져와 JSON으로 변환하여 제공
 */

const DataService = {
    fetchData: async function(dataType = 'patterns') {
        try {
            if (dataType === 'patterns') {
                return this.getPatternsData();
            }
            throw new Error(`Unknown data type: ${dataType}`);
        } catch (error) {
            console.error(`[DataService Error] ${error.message}`);
            return [];
        }
    },

    /**
     * 패턴 데이터 반환 (목업)
     * 컬럼 구성:
     * - 테이블용: customer, majorCopyright, pattern, os, inspectionDate, controlPanelName, copyrightName, 
     *            aiProductName, aiCopyrightName, aiClassType, accuracy, patternReview, reason, fileName
     * - 등록용: licenseType, swType, swGroup, summary, licenseMemo, productUrl, licenseEvidenceUrl
     */
    
 getPatternsData: function() {
        return [
            {
                id: 1,
                customer: "2",
                majorCopyright: "Y",
                pattern: "3",
                os: "Windows",
                inspectionDate: "2025-06-24",
                controlPanelName: "Autodesk Navisworks Freedom 2025",
                copyrightName: "Autodesk",
                aiProductName: "Navisworks Freedom 2015",
                aiCopyrightName: "Autodesk, Inc.",
                aiClassType: "신규",
                accuracy: "99.76%",
                patternReview: "버전업",
                reason: "Navisworks Freedom은 Autodesk 공식 제품 페이지에서 '무료 솔루션(free solution)'으로 명시되어 있으며, '구독 없이(without a Navisworks subscription)' 사용 가능하고 '지속적인 비용이 없음(no ongoing costs)'을 명확히 표기하고 있습니다. 제품 설명에서 '이해관계자(stakeholders)', '팀(teams)', '작은 회사(small firms)' 등 비즈니스 사용 사례를 공식적으로 언급하고 있으며, Autodesk 포럼에서도 뷰어 목적의 사용에는 라이선스가 필요 없다고 안내하고 있습니다. 기업 사용에 대한 명시적 금지 문구가 없고, 오히려 프로젝트 협업 및 검토를 위한 비즈니스 사용을 장려하는 내용이 포함되어 있어 기업에서 무료로 사용 가능한 것으로 판단됩니다.",
                fileName: "",
                // 등록 전용 상세 정보
                farthingProductName: "Navisworks Freedom 2025",
                farthingCopyrightName: "Autodesk, Inc.",
                licenseType: "프리",
                swType: "미지정",
                iScanSwType: "뷰어 프로그램",
                swGroup: "Autodesk Products",
                summary: "Autodesk Navisworks Freedom은 구독 없이 NWD, RCP, DWF 파일을 무료로 열람하고 탐색할 수 있는 3D 모델 뷰어로, 프로젝트 이해관계자들이 전체 프로젝트를 탐색하고 경험할 수 있도록 합니다.",
                licenseMemo: "Navisworks Freedom은 Autodesk 공식 제품 페이지에서 '무료 솔루션(free solution)'으로 명시되어 있으며, '구독 없이(without a Navisworks subscription)' 사용 가능하고 '지속적인 비용이 없음(no ongoing costs)'을 명확히 표기하고 있습니다. 제품 설명에서 '이해관계자(stakeholders)', '팀(teams)', '작은 회사(small firms)' 등 비즈니스 사용 사례를 공식적으로 언급하고 있으며, Autodesk 포럼에서도 뷰어 목적의 사용에는 라이선스가 필요 없다고 안내하고 있습니다. 기업 사용에 대한 명시적 금지 문구가 없고, 오히려 프로젝트 협업 및 검토를 위한 비즈니스 사용을 장려하는 내용이 포함되어 있어 기업에서 무료로 사용 가능한 것으로 판단됩니다.",
                productUrl: "https://www.autodesk.com",
                licenseEvidenceUrl: "https://www.autodesk.com/products/navisworks/3d-viewers, https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/What-is-Autodesk-Navisworks-Freedom.html"
            },
			{
                id: 2,
                customer: "2",
                majorCopyright: "Y",
                pattern: "2",
                os: "Windows",
                inspectionDate: "2025-07-14",
                controlPanelName: "Autodesk Navisworks Freedom 2026",
                copyrightName: "Autodesk",
                aiProductName: "Navisworks Freedom 2021",
                aiCopyrightName: "Autodesk, Inc.",
                aiClassType: "신규",
                accuracy: "99.51%",
                patternReview: "버전업",
                reason: "Navisworks Freedom은 Navisworks 구독 없이 NWD, RCP, DWF 파일을 무료로 보고 탐색할 수 있는 3D 모델 뷰어입니다. 프로젝트 관계자들이 편집 기능 없이 모델을 검토할 수 있도록 설계되었습니다.",
                fileName: "",
                // 등록 전용 상세 정보
                farthingProductName: "Navisworks Freedom 2026",
                farthingCopyrightName: "Autodesk, Inc.",
                licenseType: "프리",
                swType: "응용프로그램기타",
                iScanSwType: "뷰어 프로그램",
                swGroup: "Autodesk Products",
                summary: "Navisworks Freedom은 Navisworks 구독 없이 NWD, RCP, DWF 파일을 무료로 보고 탐색할 수 있는 3D 모델 뷰어입니다. 프로젝트 관계자들이 편집 기능 없이 모델을 검토할 수 있도록 설계되었습니다.",
                licenseMemo: "Autodesk 공식 사이트에서 Navisworks Freedom을 'free solution', 'free software with no licensing or associated fees'로 명시하고 있습니다. 이는 무료 뷰어 소프트웨어로, 라이선스 비용이 없으며 누구나 다운로드하여 사용할 수 있습니다. 웹 검색 결과에서 'the program is free to use commercially'라는 내용을 확인하였으나, 이는 공식 포럼의 답변으로 공식 EULA 문서는 아닙니다. 그러나 제품 페이지에서 명시적으로 'free'로 표기되어 있고, 기업 사용 금지 문구가 발견되지 않았으므로, 보수적 판단 원칙에 따라 프리(FREE)로 분류합니다. Navisworks Freedom은 'Freedom' Edition으로 뷰어 기능만 제공하며, 편집이나 고급 기능이 필요한 경우 유료 버전(Navisworks Manage/Simulate)을 구매해야 합니다.",
                productUrl: "https://www.autodesk.com",
                licenseEvidenceUrl: "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/What-is-Autodesk-…"
            },
			{
                id: 3,
                customer: "2",
                majorCopyright: "N",
                pattern: "2",
                os: "Windows",
                inspectionDate: "2025-07-14",
                controlPanelName: "DWGSee Pro 2024",
                copyrightName: "AutoDWG DWG Converter",
                aiProductName: "DWGSee Pro",
                aiCopyrightName: "AutoDWG DWG Converter",
                aiClassType: "신규",
                accuracy: "72.46%",
                patternReview: "버전업",
                reason: "DWGSee Pro는 AutoCAD DWG/DXF/DWF 파일을 빠르게 열람, 편집, 측정, 마크업 및 인쇄할 수 있는 경량 CAD 뷰어 소프트웨어입니다. Pro 버전은 DWG를 PDF 및 이미지로 내보내기, MS Word로 복사 등의 프리미엄 기능을 제공합니다.",
                fileName: "",
                // 등록 전용 상세 정보
                farthingProductName: "DWGSee Pro 2024",
                farthingCopyrightName: "AutoDWG DWG Converter",
                licenseType: "상용",
                swType: "응용프로그램기타",
                iScanSwType: "CAD 소프트웨어",
                swGroup: "Autodesk Products",
                summary: "DWGSee Pro는 AutoCAD DWG/DXF/DWF 파일을 빠르게 열람, 편집, 측정, 마크업 및 인쇄할 수 있는 경량 CAD 뷰어 소프트웨어입니다. Pro 버전은 DWG를 PDF 및 이미지로 내보내기, MS Word로 복사 등의 프리미엄 기능을 제공합니다.",
                licenseMemo: "DWGSee Pro 2024는 유료 Professional Edition입니다. 공식 홈페이지의 라이선스 정책 및 EULA에 따르면, 이 소프트웨어는 판매가 아닌 라이선스 방식이며 Single User License는 1인 1대의 컴퓨터에서 사용할 수 있습니다. Pro 버전은 DWG를 PDF/이미지로 내보내기 등의 프리미엄 기능을 포함하며, 가격 페이지(https://www.dwgsee.com/price.html)에서 구매가 필요합니다. 상업적 사용에 대한 파일 생성 및 배포 제한은 없으나, 라이선스 구매가 필요하므로 '상용(COMMERCIAL)'으로 판단됩니다.",
                productUrl: "https://www.dwgsee.com",
                licenseEvidenceUrl: "https://www.dwgsee.com/EULA.html, https://support.dwgsee.com/docs/license-policies/, https://www.dwgsee.com/price.html"
            },
			{
                id: 4,
                customer: "1",
                majorCopyright: "N",
                pattern: "2",
                os: "Windows",
                inspectionDate: "2026-01-14",
                controlPanelName: "EaseUS Todo Backup Free 2026",
                copyrightName: "EaseUS",
                aiProductName: "EaseUS Todo Backup Free 6",
                aiCopyrightName: "CHENGDU YIWO Tech Development Co., Ltd",
                aiClassType: "신규",
                accuracy: "100.00%",
                patternReview: "버전업",
                reason: "EaseUS Todo Backup Free는 Windows용 무료 백업 소프트웨어로, 파일/폴더 백업, 시스템 이미지 생성, 자동 백업 스케줄링 등의 기능을 제공하며, 250GB 무료 클라우드 스토리지를 30일간 제공합니다.",
                fileName: "",
                // 등록 전용 상세 정보
                farthingProductName: "EaseUS Todo Backup 2026",
                farthingCopyrightName: "CHENGDU YIWO Tech Development Co., Ltd",
                licenseType: "상용",
                swType: "유틸리티",
                iScanSwType: "백업 및 복구",
                swGroup: "미지정",
                summary: "EaseUS Todo Backup Free는 Windows용 무료 백업 소프트웨어로, 파일/폴더 백업, 시스템 이미지 생성, 자동 백업 스케줄링 등의 기능을 제공하며, 250GB 무료 클라우드 스토리지를 30일간 제공합니다.",
                licenseMemo: "공식 홈페이지(easeus.com)의 License Policy 페이지 및 제품 페이지를 확인한 결과, Free Edition은 개인/가정용으로 제공되며, 상업적 사용을 위해서는 별도의 유료 라이선스(Home, Workstation, Technician 등)를 구매해야 합니다. EULA 원문에서 명시적인 금지 문구('for personal use only' 등)를 직접 확인하지는 못했으나, License Policy에서 상업적 사용 시 10대 미만은 개별 라이선스 구매, 10대 이상은 Technician 버전 구매를 안내하고 있어, Free Edition은 기업/상업적 사용이 제한되는 것으로 판단됩니다. 따라서 기업에서 사용하려면 유료 버전이 필요하므로 '상용'으로 분류합니다.",
                productUrl: "https://www.easeus.com",
                licenseEvidenceUrl: "https://kb.easeus.com/sales/80002.html"
            },
			{
                id: 5,
                customer: "1",
                majorCopyright: "N",
                pattern: "2",
                os: "Windows",
                inspectionDate: "2025-06-12",
                controlPanelName: "EaseUS Todo Backup Free 11.5",
                copyrightName: "",
                aiProductName: "",
                aiCopyrightName: "",
                aiClassType: "예외",
                accuracy: "99.95%",
                patternReview: "버전업",
                reason: "EaseUS Todo Backup Free는 데이터 백업, 복원 및 클론 기능을 통합한 무료 백업 소프트웨어입니다. 디스크, 파티션, OS 및 파일의 백업을 생성하고 로컬 드라이브, 외장 하드 드라이브, NAS, 네트워크 및 클라우드에 저장할 수 있습니다.",
                fileName: "",
                // 등록 전용 상세 정보
                farthingProductName: "EaseUS Todo Backup 11",
                farthingCopyrightName: "CHENGDU YIWO Tech Development Co., Ltd",
                licenseType: "프리",
                swType: "유틸리티",
                iScanSwType: "백업 및 복구",
                swGroup: "미지정",
                summary: "EaseUS Todo Backup Free는 데이터 백업, 복원 및 클론 기능을 통합한 무료 백업 소프트웨어입니다. 디스크, 파티션, OS 및 파일의 백업을 생성하고 로컬 드라이브, 외장 하드 드라이브, NAS, 네트워크 및 클라우드에 저장할 수 있습니다.",
                licenseMemo: "EaseUS Todo Backup Free 11.5는 제품명에 'Free'가 명시되어 있으며, 공식 홈페이지에서 '완전히 무료이며 활성화 키가 필요 없다(completely free, without requiring any activation key to use)'고 명시하고 있습니다. 제품 페이지와 라이선스 정보를 검토한 결과, 기업 사용에 대한 명시적인 금지 문구를 찾을 수 없었습니다. EULA에는 '외부 클라이언트에게 서비스를 제공하는 용도로 사용할 수 없다(You may not use it to provide external services to your clients)'는 제한이 있으나, 이는 서비스 제공 목적의 재판매를 금지하는 것으로 기업 내부 사용을 금지하는 것은 아닙니다. 따라서 보수적 판단 원칙에도 불구하고, 명시적인 기업 사용 금지 조항이 없고 무료 소프트웨어로 제공되므로 'FREE'로 판단합니다.",
                productUrl: "https://www.easeus.com",
                licenseEvidenceUrl: "https://www.easeus.com/backup-software/tb-free.html"
            },
			{
                id: 6,
                customer: "1",
                majorCopyright: "N",
                pattern: "10",
                os: "Windows",
                inspectionDate: "2025-06-23",
                controlPanelName: "Fiddler Everywhere 6.5.0",
                copyrightName: "Progress Software Corporation",
                aiProductName: "Fiddler Everywhere 5",
                aiCopyrightName: "Progress Software Corporation",
                aiClassType: "신규",
                accuracy: "95.31%",
                patternReview: "버전업",
                reason: "Fiddler Everywhere는 macOS, Linux, Windows를 위한 네트워크 트래픽 디버깅 도구입니다. HTTP/HTTPS 트래픽을 캡처, 검사, 조작할 수 있으며 API 테스트 및 웹 디버깅 기능을 제공합니다.",
                fileName: "",
                // 등록 전용 상세 정보
                farthingProductName: "Fiddler Everywhere 6",
                farthingCopyrightName: "Progress Software Corporation",
                licenseType: "상용",
                swType: "유틸리티",
                iScanSwType: "네트워크 관리",
                swGroup: "미지정",
                summary: "Fiddler Everywhere는 macOS, Linux, Windows를 위한 네트워크 트래픽 디버깅 도구입니다. HTTP/HTTPS 트래픽을 캡처, 검사, 조작할 수 있으며 API 테스트 및 웹 디버깅 기능을 제공합니다.",
                licenseMemo: "Fiddler Everywhere는 구독 기반의 상용 소프트웨어입니다. 공식 홈페이지에서 Lite ($9/월), Pro ($12-18/월), Enterprise ($35/월)의 유료 라이선스 티어를 제공하고 있으며, 10일 무료 평가판을 제공합니다. 상업적 사용을 위해서는 라이선스 구매가 필요하며, 각 라이선스는 1명의 사용자에게 할당됩니다. EULA에 따르면 제품은 구독 라이선스 형태로 제공되며, 구독 기간이 종료되면 자동으로 갱신됩니다. 무료 버전은 평가판으로만 제공되며 기업에서 상업적으로 사용하기 위해서는 유료 라이선스가 필요합니다.",
                productUrl: "https://www.telerik.com/fiddler/fiddler-everywhere",
                licenseEvidenceUrl: "https://www.telerik.com/purchase/license-agreement/fiddler-everywhere, https://www.telerik.com/purchase/fiddler"
            },
			{
                id: 7,
                customer: "1",
                majorCopyright: "N",
                pattern: "4",
                os: "Windows",
                inspectionDate: "2025-11-21",
                controlPanelName: "Fiddler Everywhere 7.3.0",
                copyrightName: "Progress Software Corporation",
                aiProductName: "Fiddler Everywhere 3",
                aiCopyrightName: "Progress Software Corporation",
                aiClassType: "신규",
                accuracy: "74.07%",
                patternReview: "버전업",
                reason: "Fiddler Everywhere는 macOS, Linux, Windows를 위한 크로스 플랫폼 웹 디버깅 프록시 도구로, HTTPS, WebSocket, gRPC 등의 네트워크 트래픽을 캡처, 분석, 수정할 수 있는 기능을 제공합니다.",
                fileName: "",
                // 등록 전용 상세 정보
                farthingProductName: "Fiddler Everywhere 7",
                farthingCopyrightName: "Progress Software Corporation",
                licenseType: "상용",
                swType: "유틸리티",
                iScanSwType: "네트워크 관리",
                swGroup: "미지정",
                summary: "Fiddler Everywhere는 macOS, Linux, Windows를 위한 크로스 플랫폼 웹 디버깅 프록시 도구로, HTTPS, WebSocket, gRPC 등의 네트워크 트래픽을 캡처, 분석, 수정할 수 있는 기능을 제공합니다.",
                licenseMemo: "Fiddler Everywhere 7.3.0은 Progress Software Corporation이 제공하는 구독 기반 상용 소프트웨어입니다. 공식 홈페이지에 따르면 상업적 사용을 위해서는 라이선스 구매가 필요하며('To use Fiddler Everywhere commercially, you need to purchase a license'), 활성 구독을 유지해야 제품을 계속 사용할 수 있습니다('you must maintain an active subscription to continue using the product'). 10일 무료 평가판이 제공되나, 이는 기기당 1회 제한되며 평가 기간 종료 후에는 유료 구독이 필요합니다. Edition 표기가 없으나 무료로 계속 사용할 수 있는 Free Edition이나 Community Edition은 존재하지 않으며, 기업 사용 시 반드시 유료 라이선스를 구매해야 하므로 COMMERCIAL로 판단합니다.",
                productUrl: "https://www.telerik.com/fiddler/fiddler-everywhere",
                licenseEvidenceUrl: "https://www.telerik.com/purchase/license-agreement/fiddler-everywhere, https://www.telerik.com/purchase/fiddler"
            }
            
        ]
    },

    parseCSV: function(csvText) {
        try {
            const lines = csvText.trim().split('\n');
            if (lines.length < 2) return [];
            const headers = lines[0].split(',').map(h => h.trim());
            const data = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index] || '';
                });
                return obj;
            });
            return data;
        } catch (error) {
            console.error('[DataService] CSV Parsing Error:', error);
            return [];
        }
    },

    /**
     * SW 제품유형 목록 반환 (swType 기반)
     */
    getSwTypes: function() {
        const patterns = this.getPatternsData();
        const types = new Set();
        patterns.forEach(p => {
            if (p.swType && p.swType !== "미지정") types.add(p.swType);
        });
        return Array.from(types).sort();
    },

    /**
     * iScan 제품 유형 목록 반환 (iScanSwType 기반)
     */
    getIScanSwTypes: function() {
        const patterns = this.getPatternsData();
        const types = new Set();
        patterns.forEach(p => {
            if (p.iScanSwType && p.iScanSwType !== "미지정") types.add(p.iScanSwType);
        });
        return Array.from(types).sort();
    },

    /**
     * SW 그룹 목록 반환
     */
    getSwGroups: function() {
        const patterns = this.getPatternsData();
        const groups = new Set();
        patterns.forEach(p => {
            if (p.swGroup && p.swGroup !== "미지정") groups.add(p.swGroup);
        });
        return Array.from(groups).sort();
    }
};
