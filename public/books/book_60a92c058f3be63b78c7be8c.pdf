#include <iostream>
#include <vector>
#include <queue>
#include <map>
using namespace std;
const int maxc = 2e3 + 5;
vector<int> d[maxc];
int M, C;
typedef long long ll;

void sol(){
	cin >> M >> C;
	int tmp = C * (C- 1) / 2;
	for(int i=0; i<C; i++){
    d[i].clear();
	}
	map<pair<int, int>, int> m;
	while(tmp--){
		int a, b, c;
		cin >> a >> b >> c;
		d[a].push_back(b);
		m[{a, b}] = c;
		d[b].push_back(a);
		m[{b, a}] = c;
	}
    bool visit[maxc] = {0};
    priority_queue< pair<long long, int> > Q;
    long long a[maxc];
    for(int i=0; i<C; i++){
        a[i] = 1e9;
    }
    long long ans = 0;
    a[0] = 0;
    Q.push({0, 0});
    while(!Q.empty()){
        pair<ll, int> v = Q.top();
        Q.pop();
        long long x = -v.first;
        int y = v.second;
        if(visit[y]) continue;
        ans+=x;
        visit[y] = 1;
        for(int u:d[y]){
             if(visit[u]) continue;
             if(a[u] > m[{u, y}]){
                a[u] = m[{u, y}];
                Q.push({-a[u], u});
             }
         //    cout << a[u] << " " << u <<  endl;
        }
    }
   // cout << ans << endl;
    if(ans + C <= M) cout << "yes" << endl;
    else cout << "no\n";
}

int main(){
	ios_base::sync_with_stdio(false);
	cin.tie(NULL);
	int t;
	cin >> t;
	for(int i=0; i<t; i++){
		sol();
	}
}
