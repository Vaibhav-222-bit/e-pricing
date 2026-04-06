// ============================================================
// E-PRICING — Application Logic (app.js)
// Smart Price Comparison Engine with dynamic formula scoring
// ============================================================

// ─── Auth Check ──────────────────────────────────────────────
var currentUser = JSON.parse(localStorage.getItem('epricing_user'));
if (!currentUser) window.location.href = 'index.html';

// ─── State ───────────────────────────────────────────────────
var currentPage = 'search';
var searchHistory = JSON.parse(localStorage.getItem('epricing_history') || '[]');
var activeCharts = {};

// ─── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    if (currentUser) {
        document.getElementById('sidebarName').textContent = currentUser.name;
        document.getElementById('sidebarAvatar').textContent = currentUser.avatar;
    }
    renderTrendingTags();
});

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════
function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.page-section').forEach(function(el) { el.classList.remove('active'); });
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(function(el) { el.classList.remove('active'); });
    var nav = document.querySelector('.nav-item[data-page="' + page + '"]');
    if (nav) nav.classList.add('active');
    var titles = {
        search: ['Search & Compare', 'Find the best price across all platforms'],
        dashboard: ['Dashboard', 'Platform-wide analytics and insights'],
        history: ['Search History', 'Your recent product comparisons'],
        formula: ['How It Works', 'Understanding the Smart Score algorithm']
    };
    document.getElementById('pageTitle').textContent = titles[page][0];
    document.getElementById('pageSubtitle').textContent = titles[page][1];
    if (page === 'dashboard') renderDashboard();
    if (page === 'history') renderHistory();
}

// ═══════════════════════════════════════════════════════════════
// TRENDING TAGS
// ═══════════════════════════════════════════════════════════════
function renderTrendingTags() {
    var container = document.getElementById('trendingTags');
    container.innerHTML = TRENDING_SEARCHES.map(function(t) {
        return '<span class="trending-tag" onclick="quickSearch(\'' + t + '\')">' + t + '</span>';
    }).join('');
}

function quickSearch(term) {
    document.getElementById('mainSearch').value = term;
    performSearch();
}

// ═══════════════════════════════════════════════════════════════
// SEARCH ENGINE — The Core Feature
// ═══════════════════════════════════════════════════════════════
function handleSearchKeyup(event) {
    if (event.key === 'Enter') performSearch();
}

function performSearch() {
    var query = document.getElementById('mainSearch').value.trim().toLowerCase();
    if (!query) { showToast('Please enter a product name to search', 'error'); return; }

    // Find matching products (fuzzy match)
    var results = PRODUCT_DATABASE.filter(function(p) {
        var searchStr = (p.name + ' ' + p.brand + ' ' + p.category).toLowerCase();
        return query.split(' ').every(function(word) { return searchStr.includes(word); });
    });

    if (results.length === 0) {
        showToast('No products found. Try: "Samsung Galaxy" or "Air Fryer"', 'error');
        return;
    }

    // Use the first (best) match
    var product = results[0];

    // Hide search hero, show scraping animation
    document.querySelector('.search-hero').style.display = 'none';
    document.getElementById('searchResults').style.display = 'none';
    startScrapingAnimation(product);
}

// ═══════════════════════════════════════════════════════════════
// SCRAPING ANIMATION — Simulates real-time website scanning
// ═══════════════════════════════════════════════════════════════
function startScrapingAnimation(product) {
    var loader = document.getElementById('scrapingLoader');
    loader.style.display = 'block';

    // Create site indicators
    var sitesHtml = product.sites.map(function(s) {
        var siteInfo = ECOMMERCE_SITES.find(function(e) { return e.name === s.site; });
        var icon = siteInfo ? siteInfo.icon : '🌐';
        return '<div class="scrape-site" id="scrape-' + s.site.replace(/\s/g, '') + '">' + icon + ' ' + s.site + '</div>';
    }).join('');
    document.getElementById('scrapingSites').innerHTML = sitesHtml;
    document.getElementById('scrapingBarFill').style.width = '0%';

    // Animate each site being "scraped" sequentially
    var sites = product.sites;
    var delay = 0;
    sites.forEach(function(s, index) {
        var siteId = 'scrape-' + s.site.replace(/\s/g, '');
        // Start scanning
        setTimeout(function() {
            document.getElementById(siteId).classList.add('scanning');
            document.getElementById('scrapingBarFill').style.width = ((index + 0.5) / sites.length * 100) + '%';
        }, delay);
        delay += 400;
        // Mark done
        setTimeout(function() {
            document.getElementById(siteId).classList.remove('scanning');
            document.getElementById(siteId).classList.add('done');
            document.getElementById('scrapingBarFill').style.width = ((index + 1) / sites.length * 100) + '%';
        }, delay);
        delay += 200;
    });

    // Show results after all sites "scraped"
    setTimeout(function() {
        loader.style.display = 'none';
        showResults(product);
    }, delay + 300);
}

// ═══════════════════════════════════════════════════════════════
// PRICING ENGINE — The Smart Score Formula
// ═══════════════════════════════════════════════════════════════

// Calculate Smart Score for a single site listing
function calculateSmartScore(listing, allListings) {
    var prices = allListings.map(function(l) { return l.price; });
    var minPrice = Math.min.apply(null, prices);
    var maxPrice = Math.max.apply(null, prices);
    var priceRange = maxPrice - minPrice;

    // 1. Price Score: cheaper = higher score
    var priceScore = priceRange > 0 ? ((maxPrice - listing.price) / priceRange) * 100 : 50;

    // 2. Quality Score: rating out of 5
    var qualityScore = (listing.rating / 5) * 100;

    // 3. Stock Score: in stock = 100, out of stock = 0
    var stockScore = listing.inStock ? 100 : 0;

    // 4. Trust Score: verified seller + review volume
    var reviewScore = Math.min(listing.reviews / 200, 50);
    var verifiedScore = listing.verified ? 50 : 0;
    var trustScore = verifiedScore + reviewScore;

    // Weighted final score
    var finalScore = (priceScore * FORMULA_WEIGHTS.price) +
                     (qualityScore * FORMULA_WEIGHTS.quality) +
                     (stockScore * FORMULA_WEIGHTS.stock) +
                     (trustScore * FORMULA_WEIGHTS.trust);

    return {
        total: Math.round(finalScore * 10) / 10,
        priceScore: Math.round(priceScore * 10) / 10,
        qualityScore: Math.round(qualityScore * 10) / 10,
        stockScore: stockScore,
        trustScore: Math.round(trustScore * 10) / 10,
        calculations: {
            priceCalc: '(' + maxPrice + ' − ' + listing.price + ') ÷ (' + maxPrice + ' − ' + minPrice + ') × 100 = ' + priceScore.toFixed(1),
            qualityCalc: '(' + listing.rating + ' ÷ 5) × 100 = ' + qualityScore.toFixed(1),
            stockCalc: listing.inStock ? 'In Stock → 100' : 'Out of Stock → 0',
            trustCalc: (listing.verified ? '50' : '0') + ' + min(' + listing.reviews + '÷200, 50) = ' + trustScore.toFixed(1)
        }
    };
}

// ═══════════════════════════════════════════════════════════════
// SHOW RESULTS — Render everything after "scraping"
// ═══════════════════════════════════════════════════════════════
function showResults(product) {
    var results = document.getElementById('searchResults');
    results.style.display = 'block';

    // Calculate scores for all sites
    var scored = product.sites.map(function(s) {
        var score = calculateSmartScore(s, product.sites);
        return { listing: s, score: score };
    });
    // Sort by score (highest first)
    scored.sort(function(a, b) { return b.score.total - a.score.total; });
    var bestDeal = scored[0];

    // Save to history
    addToHistory(product, bestDeal);

    // 1. Product Header
    var prices = product.sites.map(function(s) { return s.price; });
    var minP = Math.min.apply(null, prices);
    var maxP = Math.max.apply(null, prices);
    document.getElementById('resultHeader').innerHTML =
        '<div class="result-product-icon">' + product.image + '</div>' +
        '<div class="result-product-info">' +
            '<h2>' + product.name + '</h2>' +
            '<div class="product-specs">' + product.specs + '</div>' +
            '<div class="product-meta">' +
                '<span class="meta-chip">🏷️ ' + product.brand + '</span>' +
                '<span class="meta-chip">📁 ' + product.category + '</span>' +
                '<span class="meta-chip">🏪 ' + product.sites.length + ' platforms scanned</span>' +
            '</div></div>';

    // 2. Price Summary Cards
    var savings = maxP - minP;
    var avgPrice = Math.round(prices.reduce(function(a, b) { return a + b; }, 0) / prices.length);
    document.getElementById('priceSummary').innerHTML =
        priceSummaryCard('💚', '₹' + formatNum(minP), 'Lowest Price', bestDeal.listing.site) +
        priceSummaryCard('🔴', '₹' + formatNum(maxP), 'Highest Price', scored[scored.length - 1].listing.site) +
        priceSummaryCard('💰', '₹' + formatNum(savings), 'You Can Save', ((savings / maxP) * 100).toFixed(1) + '% difference') +
        priceSummaryCard('📊', '₹' + formatNum(avgPrice), 'Average Price', 'Across ' + product.sites.length + ' sites');

    // 3. Best Deal Banner
    document.getElementById('bestDealBanner').innerHTML =
        '<div class="best-deal-banner">' +
            '<div class="best-deal-trophy">🏆</div>' +
            '<div class="best-deal-content">' +
                '<h3>Best Deal — ' + bestDeal.listing.site + '</h3>' +
                '<p style="opacity:0.7;font-size:0.9rem;">Our algorithm recommends this platform based on price, quality, availability & trust</p>' +
                '<div class="deal-details">' +
                    '<div class="deal-detail">💰 Price: <strong>₹' + formatNum(bestDeal.listing.price) + '</strong></div>' +
                    '<div class="deal-detail">⭐ Rating: <strong>' + bestDeal.listing.rating + '/5</strong></div>' +
                    '<div class="deal-detail">📦 <strong>' + (bestDeal.listing.inStock ? 'In Stock' : 'Out of Stock') + '</strong></div>' +
                    '<div class="deal-detail">🚚 ' + bestDeal.listing.delivery + '</div>' +
                '</div></div>' +
            '<div class="best-deal-score"><div class="score-value">' + bestDeal.score.total + '</div><div class="score-label">Smart Score</div></div>' +
        '</div>';

    // 4. Comparison Table
    document.getElementById('comparisonBody').innerHTML = scored.map(function(item, idx) {
        var l = item.listing;
        var s = item.score;
        var isBest = idx === 0;
        var discount = Math.round((1 - l.price / l.mrp) * 100);
        var siteInfo = ECOMMERCE_SITES.find(function(e) { return e.name === l.site; });
        var barColor = s.total >= 70 ? 'var(--success)' : s.total >= 50 ? 'var(--accent)' : 'var(--danger)';
        return '<tr class="' + (isBest ? 'best-row' : '') + '">' +
            '<td><div class="site-name"><span class="site-dot" style="background:' + (siteInfo ? siteInfo.color : '#999') + '"></span>' + l.site + '</div></td>' +
            '<td class="price-cell">₹' + formatNum(l.price) + '</td>' +
            '<td style="color:var(--text-muted);text-decoration:line-through;font-size:0.82rem;">₹' + formatNum(l.mrp) + '</td>' +
            '<td><span class="discount-badge">' + discount + '% off</span></td>' +
            '<td>⭐ ' + l.rating + '</td>' +
            '<td>' + formatNum(l.reviews) + '</td>' +
            '<td><span class="' + (l.inStock ? 'stock-yes' : 'stock-no') + '">' + (l.inStock ? '✅ Yes' : '❌ No') + '</span></td>' +
            '<td><span class="' + (l.verified ? 'verified-yes' : 'verified-no') + '">' + (l.verified ? '🛡️ Yes' : '⚠️ No') + '</span></td>' +
            '<td style="font-size:0.8rem;">' + l.delivery + '</td>' +
            '<td><div class="score-cell"><span class="score-number" style="color:' + barColor + '">' + s.total + '</span>' +
                '<div class="score-bar-bg"><div class="score-bar-fill" style="width:' + s.total + '%;background:' + barColor + '"></div></div>' +
            '</div></td></tr>';
    }).join('');

    // 5. Formula Breakdown Table
    document.getElementById('formulaBreakdown').innerHTML =
        '<p style="color:var(--text-secondary);margin-bottom:1rem;">Here\'s exactly how we calculated the Smart Score for each platform. Full transparency — no black box!</p>' +
        '<div class="table-wrapper"><table class="formula-table"><thead><tr>' +
            '<th>Platform</th><th>Price Score<br><small>(35%)</small></th><th>Quality Score<br><small>(25%)</small></th>' +
            '<th>Stock Score<br><small>(20%)</small></th><th>Trust Score<br><small>(20%)</small></th><th>Final Score</th>' +
        '</tr></thead><tbody>' +
        scored.map(function(item) {
            var s = item.score;
            var c = s.calculations;
            return '<tr><td><strong>' + item.listing.site + '</strong></td>' +
                '<td>' + s.priceScore + '<br><span class="calc">' + c.priceCalc + '</span></td>' +
                '<td>' + s.qualityScore + '<br><span class="calc">' + c.qualityCalc + '</span></td>' +
                '<td>' + s.stockScore + '<br><span class="calc">' + c.stockCalc + '</span></td>' +
                '<td>' + s.trustScore + '<br><span class="calc">' + c.trustCalc + '</span></td>' +
                '<td><strong style="font-size:1.1rem;color:var(--primary);">' + s.total + '</strong><br>' +
                '<span class="calc">' + s.priceScore + '×0.35 + ' + s.qualityScore + '×0.25 + ' + s.stockScore + '×0.20 + ' + s.trustScore + '×0.20</span></td></tr>';
        }).join('') + '</tbody></table></div>';

    // 6. Charts
    renderResultCharts(product, scored);

    // Scroll to results
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function priceSummaryCard(icon, value, label, sub) {
    return '<div class="price-summary-card"><div class="psc-icon">' + icon + '</div>' +
        '<div class="psc-value">' + value + '</div>' +
        '<div class="psc-label">' + label + '</div>' +
        '<div class="psc-sub">' + sub + '</div></div>';
}

// ═══════════════════════════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════════════════════════
function renderResultCharts(product, scored) {
    // Destroy old charts
    if (activeCharts.priceCompare) activeCharts.priceCompare.destroy();
    if (activeCharts.scoreBreakdown) activeCharts.scoreBreakdown.destroy();

    var labels = scored.map(function(s) { return s.listing.site; });
    var colors = scored.map(function(s) {
        var info = ECOMMERCE_SITES.find(function(e) { return e.name === s.listing.site; });
        return info ? info.color : '#999';
    });

    // Price Comparison Bar Chart
    activeCharts.priceCompare = new Chart(document.getElementById('chartPriceCompare'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Price (₹)', data: scored.map(function(s) { return s.listing.price; }),
                backgroundColor: colors.map(function(c) { return c + 'CC'; }), borderRadius: 8, borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: { x: { grid: { color: '#F3F4F6' }, ticks: { callback: function(v) { return '₹' + (v/1000).toFixed(0) + 'K'; } } }, y: { grid: { display: false } } }
        }
    });

    // Score Breakdown Stacked Bar
    activeCharts.scoreBreakdown = new Chart(document.getElementById('chartScoreBreakdown'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Price (35%)', data: scored.map(function(s) { return (s.score.priceScore * 0.35).toFixed(1); }), backgroundColor: '#FF6B35CC', borderRadius: 4 },
                { label: 'Quality (25%)', data: scored.map(function(s) { return (s.score.qualityScore * 0.25).toFixed(1); }), backgroundColor: '#F7B32BCC', borderRadius: 4 },
                { label: 'Stock (20%)', data: scored.map(function(s) { return (s.score.stockScore * 0.20).toFixed(1); }), backgroundColor: '#10B981CC', borderRadius: 4 },
                { label: 'Trust (20%)', data: scored.map(function(s) { return (s.score.trustScore * 0.20).toFixed(1); }), backgroundColor: '#3B82F6CC', borderRadius: 4 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
            scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: '#F3F4F6' }, max: 100 } }
        }
    });
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function renderDashboard() {
    var totalProducts = PRODUCT_DATABASE.length;
    var totalListings = PRODUCT_DATABASE.reduce(function(sum, p) { return sum + p.sites.length; }, 0);
    var cats = {};
    PRODUCT_DATABASE.forEach(function(p) { cats[p.category] = (cats[p.category] || 0) + 1; });

    document.getElementById('dashStats').innerHTML =
        statCard('📦', totalProducts, 'Products in Database') +
        statCard('🏪', totalListings, 'Total Listings Tracked') +
        statCard('🔍', searchHistory.length, 'Searches Performed') +
        statCard('📁', Object.keys(cats).length, 'Categories Covered');

    if (activeCharts.category) activeCharts.category.destroy();
    if (activeCharts.savings) activeCharts.savings.destroy();

    activeCharts.category = new Chart(document.getElementById('chartCategory'), {
        type: 'doughnut',
        data: { labels: Object.keys(cats), datasets: [{ data: Object.values(cats), backgroundColor: ['#FF6B35','#1B998B','#F7B32B','#3B82F6','#EF4444','#8B5CF6'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom' } } }
    });

    // Average savings by platform
    var siteSavings = {};
    PRODUCT_DATABASE.forEach(function(p) {
        var prices = p.sites.map(function(s) { return s.price; });
        var maxP = Math.max.apply(null, prices);
        p.sites.forEach(function(s) {
            if (!siteSavings[s.site]) siteSavings[s.site] = { total: 0, count: 0 };
            siteSavings[s.site].total += ((maxP - s.price) / maxP) * 100;
            siteSavings[s.site].count++;
        });
    });
    var siteNames = Object.keys(siteSavings);
    var avgSavingsData = siteNames.map(function(name) { return Math.round(siteSavings[name].total / siteSavings[name].count * 10) / 10; });

    activeCharts.savings = new Chart(document.getElementById('chartSavings'), {
        type: 'bar',
        data: {
            labels: siteNames,
            datasets: [{ label: 'Avg Savings %', data: avgSavingsData, backgroundColor: siteNames.map(function(n) {
                var info = ECOMMERCE_SITES.find(function(e) { return e.name === n; });
                return info ? info.color + 'CC' : '#999';
            }), borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: '#F3F4F6' }, ticks: { callback: function(v) { return v + '%'; } } }, x: { grid: { display: false } } } }
    });
}

function statCard(icon, value, label) {
    return '<div class="stat-card"><div class="stat-icon">' + icon + '</div><div class="stat-value">' + value + '</div><div class="stat-label">' + label + '</div></div>';
}

// ═══════════════════════════════════════════════════════════════
// SEARCH HISTORY
// ═══════════════════════════════════════════════════════════════
function addToHistory(product, bestDeal) {
    searchHistory.unshift({
        name: product.name, icon: product.image, bestSite: bestDeal.listing.site,
        bestPrice: bestDeal.listing.price, score: bestDeal.score.total,
        time: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
    });
    if (searchHistory.length > 20) searchHistory.pop();
    localStorage.setItem('epricing_history', JSON.stringify(searchHistory));
}

function renderHistory() {
    var list = document.getElementById('historyList');
    if (searchHistory.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--text-muted);"><div style="font-size:3rem;margin-bottom:1rem;">🔍</div><h3 style="color:var(--text-secondary);">No searches yet!</h3><p>Search for a product to see your comparison history here.</p></div>';
        return;
    }
    list.innerHTML = searchHistory.map(function(h) {
        return '<div class="history-card" onclick="quickSearch(\'' + h.name.split(' ').slice(0, 3).join(' ') + '\')">' +
            '<div class="history-left"><span class="history-icon">' + h.icon + '</span><div><div class="history-name">' + h.name + '</div><div class="history-time">' + h.time + '</div></div></div>' +
            '<div class="history-right"><div class="history-best">🏆 ' + h.bestSite + '</div><div class="history-price">₹' + formatNum(h.bestPrice) + '</div></div></div>';
    }).join('');
}

function clearHistory() {
    searchHistory = [];
    localStorage.removeItem('epricing_history');
    renderHistory();
    showToast('History cleared!', 'success');
}

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════
function formatNum(n) {
    if (!n) return '—';
    var s = n.toString();
    var last3 = s.substring(s.length - 3);
    var rest = s.substring(0, s.length - 3);
    if (rest !== '') last3 = ',' + last3;
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last3;
}

function showToast(msg, type) {
    var c = document.getElementById('toastContainer');
    var t = document.createElement('div');
    t.className = 'toast toast-' + (type || '');
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(function() { t.style.opacity = '0'; }, 2500);
    setTimeout(function() { c.removeChild(t); }, 3000);
}

function handleLogout() {
    if (confirm('Sign out?')) { localStorage.removeItem('epricing_user'); window.location.href = 'index.html'; }
}
