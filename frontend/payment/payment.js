// Payment data
const paymentData = [
    {
        room: '1104',
        notificationDate: '01/09/2025',
        dueDate: '10/09/2025',
        paymentDate: '-',
        amount: '5,500 บาท',
        status: 'overdue'
    },
    {
        room: '1104',
        notificationDate: '01/08/2025',
        dueDate: '10/08/2025',
        paymentDate: '05/08/2025',
        amount: '5,700 บาท',
        status: 'paid'
    },
    {
        room: '1104',
        notificationDate: '01/07/2025',
        dueDate: '10/07/2025',
        paymentDate: '05/07/2025',
        amount: '5,900 บาท',
        status: 'paid'
    },
    {
        room: '1104',
        notificationDate: '01/06/2025',
        dueDate: '10/06/2025',
        paymentDate: '05/06/2025',
        amount: '6,500 บาท',
        status: 'paid'
    }
];

// Global variables for popup
let currentInvoice = null;
let selectedFile = null;

// Function to create download button only
function createDownloadButton(status, index) {
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.onclick = () => handleDownloadClick(status, index);
    downloadBtn.title = status === 'overdue' ? 'ดาวน์โหลดใบแจ้งหนี้' : 'ดาวน์โหลดใบเสร็จ';
    
    // Create download icon (SVG)
    downloadBtn.innerHTML = `
        <svg class="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2-2H5a2 2 0 01-2-2z"/>
        </svg>
    `;
    
    return downloadBtn;
}

// Function to create status badges only
function createStatusBadges(status, index) {
    const badgeContainer = document.createElement('div');
    badgeContainer.className = 'badge-container';
    
    if (status === 'overdue') {
        const overdueBadge = document.createElement('button');
        overdueBadge.className = 'badge overdue';
        overdueBadge.textContent = 'ค้างชำระ';
        
        const paymentBadge = document.createElement('button');
        paymentBadge.className = 'badge payment';
        paymentBadge.textContent = 'ชำระเงิน';
        paymentBadge.onclick = () => openPaymentPopup(index);
        
        badgeContainer.appendChild(overdueBadge);
        badgeContainer.appendChild(paymentBadge);
    } else if (status === 'paid') {
        const paidBadge = document.createElement('button');
        paidBadge.className = 'badge paid';
        paidBadge.textContent = 'ชำระแล้ว';
        
        const detailsBadge = document.createElement('button');
        detailsBadge.className = 'badge details';
        detailsBadge.textContent = 'ดูรายละเอียด';
        detailsBadge.onclick = () => handleDetailsClick(index);
        
        badgeContainer.appendChild(paidBadge);
        badgeContainer.appendChild(detailsBadge);
    } else if (status === 'pending') {
        const pendingBadge = document.createElement('button');
        pendingBadge.className = 'badge pending';
        pendingBadge.textContent = 'รอตรวจสอบ';
        
        badgeContainer.appendChild(pendingBadge);
    }
    
    return badgeContainer;
}

// Function to populate table
function populateTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear existing content
    
    paymentData.forEach((row, index) => {
        const tableRow = document.createElement('div');
        tableRow.className = 'table-row';
        tableRow.dataset.index = index; // เก็บ index เพื่อใช้ในการอัปเดต
        
        // Create data cells (first 5 columns)
        const cells = [
            row.room,
            row.notificationDate,
            row.dueDate,
            row.paymentDate,
            row.amount
        ];
        
        cells.forEach((cellData, cellIndex) => {
            const cell = document.createElement('div');
            cell.className = 'table-cell';
            cell.textContent = cellData;
            
            // Add data labels for mobile responsiveness
            const labels = ['ห้อง', 'วันที่แจ้ง', 'กำหนดชำระ', 'วันที่ชำระ', 'จำนวนเงิน'];
            cell.setAttribute('data-label', labels[cellIndex]);
            
            tableRow.appendChild(cell);
        });
        
        // Create download cell (column 6)
        const downloadCell = document.createElement('div');
        downloadCell.className = 'table-cell';
        downloadCell.setAttribute('data-label', 'ดาวน์โหลด');
        downloadCell.appendChild(createDownloadButton(row.status, index));
        tableRow.appendChild(downloadCell);
        
        // Create status cell (column 7)
        const statusCell = document.createElement('div');
        statusCell.className = 'table-cell';
        statusCell.setAttribute('data-label', 'สถานะ');
        statusCell.appendChild(createStatusBadges(row.status, index));
        tableRow.appendChild(statusCell);
        
        tableBody.appendChild(tableRow);
    });
}

// Navigation handlers
function handleNavigation() {
    const navItems = document.querySelectorAll('.nav-item:not(.logout)');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update page title based on clicked item
            const pageTitle = document.querySelector('.page-title');
            const itemText = this.querySelector('span').textContent;
            pageTitle.textContent = itemText;
        });
    });
}

// Payment Popup Functions
function openPaymentPopup(index) {
    const invoice = paymentData[index];
    currentInvoice = { ...invoice, index };
    
    // Update amount display
    const cleanAmount = invoice.amount.replace(' บาท', '').replace(',', '');
    document.getElementById('displayAmount').innerHTML = `${cleanAmount}<span class="currency">บาท</span>`;
    
    // Update payment name
    document.getElementById('paymentName').textContent = `คุณอเนชา (ห้อง ${invoice.room})`;
    
    // Reset form
    resetPopupState();
    
    // Show popup
    const popup = document.getElementById('paymentPopup');
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePaymentPopup() {
    const popup = document.getElementById('paymentPopup');
    popup.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentInvoice = null;
    selectedFile = null;
}

function resetPopupState() {
    document.getElementById('paymentContent').style.display = 'block';
    document.getElementById('successMessage').classList.remove('show');
    document.getElementById('filePreview').classList.remove('show');
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('fileInput').value = '';
    selectedFile = null;
}

// File handling functions
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        displayFile(file);
    }
}

function displayFile(file) {
    selectedFile = file;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        alert('กรุณาเลือกไฟล์ .jpg, .png หรือ .pdf เท่านั้น');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
    }
    
    // Display file info
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('filePreview').classList.add('show');
    document.getElementById('submitBtn').disabled = false;
}

function removeFile() {
    selectedFile = null;
    document.getElementById('filePreview').classList.remove('show');
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('fileInput').value = '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function submitPayment() {
    if (!selectedFile) {
        alert('กรุณาเลือกไฟล์หลักฐานการชำระเงิน');
        return;
    }

    // Hide payment content
    document.getElementById('paymentContent').style.display = 'none';
    
    // Show success message
    document.getElementById('successMessage').classList.add('show');
    
    // Update payment data and table
    if (currentInvoice && typeof currentInvoice.index !== 'undefined') {
        // Update payment data
        paymentData[currentInvoice.index].status = 'pending';
        paymentData[currentInvoice.index].paymentDate = new Date().toLocaleDateString('th-TH');
        
        // Refresh table
        populateTable();
    }
    
    // Auto close after 3 seconds
    setTimeout(() => {
        closePaymentPopup();
    }, 3000);
    
    console.log('Uploading file:', selectedFile);
    console.log('Invoice:', currentInvoice);
}

// Badge click handlers
function handleDetailsClick(index) {
    const invoice = paymentData[index];
    alert(`รายละเอียดการชำระเงิน:\nห้อง: ${invoice.room}\nจำนวนเงิน: ${invoice.amount}\nวันที่ชำระ: ${invoice.paymentDate}`);
}

// Download click handler
// function handleDownloadClick(status, index) {
//     const roomNumber = paymentData[index].room;
//     const message = status === 'overdue' ? 
//         `กำลังดาวน์โหลดใบแจ้งหนี้ ห้อง ${roomNumber}...` : 
//         `กำลังดาวน์โหลดใบเสร็จ ห้อง ${roomNumber}...`;
//     alert(message);
//     console.log('Downloading payment record for room:', roomNumber, 'status:', status);
// }
function handleDownloadClick(status, index) {
    const invoice = paymentData[index];
    
    // สร้าง URL parameters
    const params = new URLSearchParams({
        room: invoice.room,
        status: status,
        index: index,
        issueDate: invoice.notificationDate,
        dueDate: invoice.dueDate,
        paymentDate: invoice.paymentDate,
        amount: invoice.amount
    });
    
    // เปิดหน้ารายละเอียดในแท็บใหม่
    window.open(`invoice-detail.html?${params.toString()}`, '_blank');
}

// Header button handlers
function handleNotificationClick() {
    alert('เปิดการแจ้งเตือน');
}

function handleUserClick() {
    alert('เปิดเมนูผู้ใช้');
}

function handleLogoutClick() {
    if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
        alert('ออกจากระบบเรียบร้อย');
        // Here you would typically redirect to login page
        // window.location.href = '/login';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Populate the payment table
    populateTable();
    
    // Setup navigation handlers
    handleNavigation();
    
    // Setup header button handlers
    document.getElementById('notificationBtn').addEventListener('click', handleNotificationClick);
    document.getElementById('userBtn').addEventListener('click', handleUserClick);
    document.getElementById('logoutBtn').addEventListener('click', handleLogoutClick);
    
    // Setup file input handler
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    
    // Setup popup close handlers
    document.getElementById('paymentPopup').addEventListener('click', function(e) {
        if (e.target === this) {
            closePaymentPopup();
        }
    });
    
    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePaymentPopup();
        }
    });
    
    console.log('ROOMIN Application initialized successfully!');
});

// Additional utility functions
function refreshTable() {
    populateTable();
}

function addPaymentRecord(record) {
    paymentData.push(record);
    populateTable();
}

// Export functions for potential use by other scripts
window.RoominApp = {
    refreshTable,
    addPaymentRecord,
    paymentData,
    openPaymentPopup,
    closePaymentPopup
};

// Sidebar toggle
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.getElementById('menuToggle');

// สร้าง overlay
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});
